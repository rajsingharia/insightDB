import { Alerts } from "@prisma/client";
import { BaseConsumer, Subjects } from "insightdb-common";
import { AlertTriggerProducer } from "../producers/AlertTriggerProducer";
import { KafkaService } from "../../services/kafka.service";
import { AlertService } from "../../services/alert.service";

interface FetchDataEventConsumer {
    subject: Subjects.DataReceive,
    data: {
        rows: unknown[],
        alert: Alerts
    }
}



export class FetchDataConsumer extends BaseConsumer<FetchDataEventConsumer> {
    subject: Subjects.DataReceive = Subjects.DataReceive
    onMessage(data: { rows: unknown[]; alert: Alerts }): void {
        console.log("Received data fetch from data service...")
        try {
            const condition = this.checkConditionForAlertGeneration(data.rows, data.alert)
            if (condition) {
                this.sendAlerts(data.alert)
            }
        } catch (error) {
            console.log(`Error processing message ${JSON}`)
        }

    }
    private async sendAlerts(alert: Alerts) {
        const integration = await AlertService.getIntegrationFromAlert(alert.id)
        if (integration != null) {
            console.log("Sending alert data to alertTrigger service...")
            await new AlertTriggerProducer(KafkaService.getInstance())
                .publish({
                    alert: alert,
                    rawQuery: alert.rawQuery,
                    integrationType: integration?.type,
                    integrationCredentials: integration?.credentials
                })
            console.log("Successfully Sent alert data to alertTrigger service")
        }
    }


    private checkConditionForAlertGeneration(rows: unknown[], alert: Alerts): boolean {

        let conditionMet = true;

        const data = rows[0] as { [key: string]: string };

        const { row, condition, value } = alert.configuration! as { row: string, condition: string, value: string }

        if (!Number(data[row])) throw new Error('Value at given index is not a number');

        switch (condition) {
            case 'equal':
                conditionMet = Number(data[row]) === Number(value);
                break;
            case 'notEqual':
                conditionMet = !(Number(data[row]) === Number(value));
                break;
            case 'greaterThan':
                conditionMet = Number(data[row]) > Number(value);
                break;
            case 'lessThan':
                conditionMet = Number(data[row]) < Number(value);
                break;
            case 'greaterThanEqual':
                conditionMet = Number(data[row]) >= Number(value);
                break;
            case 'lessThanEqual':
                conditionMet = Number(data[row]) <= Number(value);
                break;
            default:
                console.log(`Invalid Condition ${condition}`);
        }
        return conditionMet
    }

}