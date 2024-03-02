import { Alerts } from "@prisma/client";
import { BaseProducer, Subjects } from "insightdb-common";

interface FetchDataEventProducer {
    subject: Subjects.DataFetch,
    data: {
        alert: Alerts,
        integrationId: string
    }
}


export class FetchDataProducer extends BaseProducer<FetchDataEventProducer> {
    topic: Subjects.DataFetch = Subjects.DataFetch;
    async init(): Promise<void> {
        await super.init();
    }
}