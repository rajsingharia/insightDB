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
    subject: Subjects.Alert = Subjects.Alert
    onMessage(data: { alert: Alerts }): void {
        this.sendAlert(data.alert)
    }

    private async sendAlert(alert: Alerts) {
        const alertData = await AlertTriggerService.makeAlert(alert);
        if (alertData != undefined) {
            // new AlertTriggerProducer(KafkaService.getInstance()).publish({ alertData });
            const alertTriggerProducer = new AlertTriggerProducer(KafkaService.getInstance());
            await alertTriggerProducer.init();
            await alertTriggerProducer.publish({ alertData });
            await alertTriggerProducer.disconnect(); // Disconnect when done
        }
    }
}