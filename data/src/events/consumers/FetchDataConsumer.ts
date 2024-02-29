import { Alerts } from "@prisma/client";
import { BaseConsumer, Subjects } from "insightdb-common";
import { KafkaService } from "../../services/kafka.service";
import { JsonValue } from "@prisma/client/runtime/library";
import { fetchDataService } from "../../services/fetchData.service";
import createHttpError from "http-errors";
import { FetchDataProducer } from "../producers/FetchDataProducer";

interface FetchDataEventConsumer {
    subject: Subjects.DataFetch,
    data: {
        alert: Alerts,
        rawQuery: string,
        integrationType: string,
        integrationCredentials: JsonValue
    }
}



export class FetchDataConsumer extends BaseConsumer<FetchDataEventConsumer> {
    subject: Subjects.DataFetch = Subjects.DataFetch
    onMessage(data: { alert: Alerts; rawQuery: string; integrationType: string; integrationCredentials: JsonValue }): void {
        console.log("Received alert for data fetching :: ", data)
        try {
            if (data.alert && data.rawQuery && data.integrationType && data.integrationCredentials) {
                this.fetchData(data.alert, data.rawQuery, data.integrationType, data.integrationCredentials)
            }
        } catch (err) {
            console.log(`Error in Sending Data Event : ${err}`)
        }
    }

    private async fetchData(alert: Alerts, rawQuery: string, integrationType: string, integrationCredentials: JsonValue) {
        const allData = await fetchDataService.getAllDataFromRawQuery(integrationType, integrationCredentials, rawQuery);
        if (!allData) throw createHttpError(404, "Unable to fetch data");
        const { data } = allData;
        console.log("Sending data fetch back to alert service...")
        const fetchDataProducer = new FetchDataProducer(KafkaService.getInstance());
        await fetchDataProducer.init();
        await fetchDataProducer.publish({ rows: data, alert: alert });
        await fetchDataProducer.disconnect(); // Disconnect when done
        console.log("Successfully Sent data fetch back to alert service")
    }

}