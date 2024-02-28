import { BaseConsumer, Subjects } from "insightdb-common";
import { AlertService } from "../../services/alert.service";
import { AlertTriggerDTO } from "../../dto/request/alertTrigger";

interface AlertTriggerEventConsumer {
    subject: Subjects.AlertTrigger,
    data: {
        alertData: AlertTriggerDTO
    }
}



export class AlertTriggerConsumer extends BaseConsumer<AlertTriggerEventConsumer> {
    onMessage(data: { alertData: AlertTriggerDTO }): void {
        this.addAlertTriggerData(data.alertData)
    }
    subject: Subjects.AlertTrigger = Subjects.AlertTrigger

    private async addAlertTriggerData(alertData: AlertTriggerDTO) {
        await AlertService.addAlertTrigger(alertData)
    }
}