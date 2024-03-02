import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { fetchDataService } from "../services/fetchData.service";
import FetchDataDTO from "../dto/response/fetchData.dto";
import { InsightService } from "../services/insight.service";
import { IntegrationService } from "../services/integration.service";



export default class FetchDataController {

    public static getAllData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const  { insightId  } = req.body;

            const insight = await InsightService.getInsightWithIntegrationById(insightId);

            if(!insight) throw createHttpError(404, "Associated insight not found");

            if(!insight.integration) throw createHttpError(404, "Associated integration not found");

            const allData = await fetchDataService.getAllDataFromRawQuery(insight.integration.type, insight.integration.credentials, insight.rawQuery);

            if (!allData) throw createHttpError(404, "Unable to fetch data");

            const { fields, data } = allData;

            const response: FetchDataDTO = {
                countOfFields: fields?.length,
                fields: fields,
                countOfData: data.length,
                data: data
            }

            if (!data) throw createHttpError(404, "Unable to fetch data");
            res.status(200).json(response);

        } catch (error) {
            next(error);
        }
    }

    public static getAllDataForQuery = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const  { integrationId, rawQuery  } = req.body;

            const integration = await IntegrationService.getIntegrationById(integrationId);

            if(!integration) throw createHttpError(404, "Associated integration not found");

            const allData = await fetchDataService.getAllDataFromRawQuery(integration.type, integration.credentials, rawQuery);

            if (!allData) throw createHttpError(404, "Unable to fetch data");

            const { fields, data } = allData;

            const response: FetchDataDTO = {
                countOfFields: fields?.length,
                fields: fields,
                countOfData: data.length,
                data: data
            }

            if (!data) throw createHttpError(404, "Unable to fetch data");
            res.status(200).json(response);

        } catch (error) {
            next(error);
        }
    }

}