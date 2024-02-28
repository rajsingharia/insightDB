import { BaseConsumer, Subjects } from "insightdb-common";
import { AlertTriggerService } from "../../services/alertTrigger.service";
import { AlertTriggerProducer } from "../producers/AlertTriggerProducer";
import { Alerts } from "../../types/alert.type";
import { KafkaService } from "../../services/kafka.service";

interface AlertTriggerEventConsumer {
    subject: Subjects.Alert,
    data: {
        alert: Alerts
    }
}

export class AlertTriggerConsumer extends BaseConsumer<AlertTriggerEventConsumer> {
    onMessage(data: { alert: Alerts }): void {
        this.sendAlert(data.alert)
    }
    subject: Subjects.Alert = Subjects.Alert

    private async sendAlert(alert: Alerts) {
        const alertData = await AlertTriggerService.makeAlert(alert);
        if(alertData != undefined) {
            new AlertTriggerProducer(KafkaService.getInstance()).publish({ alertData });
        }
    }
}