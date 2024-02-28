import { Alerts } from "@prisma/client";
import { BaseProducer, Subjects } from "insightdb-common";

interface FetchDataEventProducer {
    subject: Subjects.DataFetch,
    data: {
        alert: Alerts
    }
}


export class FetchDataProducer extends BaseProducer<FetchDataEventProducer> {
    topic: string = Subjects.DataFetch;
}