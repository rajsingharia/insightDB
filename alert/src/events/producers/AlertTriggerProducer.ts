import { Alerts } from "@prisma/client";
import { BaseProducer, Subjects } from "insightdb-common";

interface AlertTriggerEventProducer {
    subject: Subjects.Alert,
    data: {
        alert: Alerts
    }
}


export class AlertTriggerProducer extends BaseProducer<AlertTriggerEventProducer> {
    topic: Subjects.Alert = Subjects.Alert;
    async init(): Promise<void> {
        await super.init();
    }
}