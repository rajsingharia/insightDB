import { Alerts } from "@prisma/client";
import { BaseProducer, Subjects } from "insightdb-common";

interface FetchDataEventProducer {
    subject: Subjects.DataReceive,
    data: {
        rows: unknown[],
        alert: Alerts
    }
    
}


export class FetchDataProducer extends BaseProducer<FetchDataEventProducer> {
    topic: string = Subjects.DataReceive;
}