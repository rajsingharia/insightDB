import { BaseProducer, Subjects } from "insightdb-common";
import { AlertTriggerResponse } from "../../types/alertTriggerResponse.type";

interface AlertTriggerEventProducer {
    subject: Subjects.AlertTrigger,
    data: {
        alertData: AlertTriggerResponse
    }
}


export class AlertTriggerProducer extends BaseProducer<AlertTriggerEventProducer> {
    topic: string = Subjects.DataFetch;
    async init(): Promise<void> {
        await super.init();
    }
}