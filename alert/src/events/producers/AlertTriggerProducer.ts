import { Alerts } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { BaseProducer, Subjects } from "insightdb-common";

interface AlertTriggerEventProducer {
    subject: Subjects.Alert,
    data: {
        alert: Alerts,
        rawQuery: string,
        integrationType: string,
        integrationCredentials: JsonValue
    }
}


export class AlertTriggerProducer extends BaseProducer<AlertTriggerEventProducer> {
    topic: string = Subjects.DataFetch;
}