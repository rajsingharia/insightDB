import { Alerts } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { BaseProducer, Subjects } from "insightdb-common";

interface FetchDataEventProducer {
    subject: Subjects.DataFetch,
    data: {
        alert: Alerts,
        rawQuery: string,
        integrationType: string,
        integrationCredentials: JsonValue
    }
}


export class FetchDataProducer extends BaseProducer<FetchDataEventProducer> {
    topic: Subjects.DataFetch = Subjects.DataFetch;
    async init(): Promise<void> {
        await super.init();
    }
}