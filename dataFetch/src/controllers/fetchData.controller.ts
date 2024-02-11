import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { fetchDataService } from "../services/fetchData.service";
import FetchDataDTO from "../dto/response/fetchData.dto";
import { InsightService } from "../services/insight.service";
import { OrganizationService } from "../services/org.service";


interface IGetAllDataRequest extends Request {
    body: {
        userId: string;
        organizationId: string;
        rawQuery: string;
        integrationId: string;
    }
}

interface IGetAllDataSSERequest extends Request {
    params: {
        insightId: string;
    }
}


export default class FetchDataController {
    public static getAllData = async (req: IGetAllDataRequest, res: Response, next: NextFunction) => {
        try {
            const organizationId = req.body.organizationId;
            const integrationId = req.body.integrationId;

            const integration = await OrganizationService.getOrganizationIntegrationById(organizationId, integrationId);
            if (!integration) throw createHttpError(404, "Integration not found");

            const rawQuery = req.body.rawQuery;

            // const parameters = createParametersDTO(integration.type);
            // console.log(parameters)

            // Object.assign(parameters, req.body.parameters);

            // const validationErrors = await validate(parameters);
            // console.log(validationErrors)

            // if (validationErrors.length > 0) {
            //     throw createHttpError(400, `Validation error: ${validationErrors}`);
            // }

            const allData = await fetchDataService.getAllDataFromRawQuery(integration.type, integration.credentials, rawQuery);

            //console.log(allData)

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

    public static getAllDataSSE = async (req: IGetAllDataSSERequest, res: Response, next: NextFunction) => {
        try {

            //TODO: Get userId from token
            //TODO: See if this userId has access to this insight (If not, throw 403 error)
            //TODO: See if the user is already connected to SSE (If yes, throw 403 error)
            //TODO: If everything is ok, then connect the user to SSE

            //TODO: Store the user in SSE (maybe in Redis)
            //(why store the user in SSE? - because we need to know which user is connected to SSE and send data to that user only) 
            //(this could be a very large data structure, so maybe store only the userId and the insightId in SSE)
            //TODO: If the user disconnects, then remove the user from SSE (or maybe keep the user connected to SSE for 5 minutes after the user disconnects)
            //TODO: If the user is not connected to SSE for 5 minutes, then remove the user from SSE
            //TODO: If the user is connected to SSE, then send data to the user every refreshRate seconds


            const organizationId = 'd51539c9-f561-48e7-9aff-66a76d285e07';
            const insightId = req.params.insightId;

            const insight = await InsightService.getInsightById(insightId);
            if (!insight) throw createHttpError(404, "Insight not found");

            const integrationId = insight.integrationId;
            const refreshRate = insight.refreshRate;

            const integration = await OrganizationService.getOrganizationIntegrationById(organizationId, integrationId);
            if (!integration) throw createHttpError(404, "Integration not found");

            // const parameters = createParametersDTO(integration.type);

            // Object.assign(parameters, insight.parameters);

            // const validationErrors = await validate(parameters);
            // if (validationErrors.length > 0) {
            //     throw createHttpError(400, `Validation error: ${validationErrors}`);
            // }

            res.set("Content-Type", "text/event-stream");
            res.set("Cache-Control", "no-cache");
            res.set("Connection", "keep-alive");
            res.set("Access-Control-Allow-Origin", "*");

            // const parametersString = JSON.stringify(parameters);

            setInterval(async () => {

                const rawQuery = req.body.rawQuery;
                
                const allData = await fetchDataService.getAllDataFromRawQuery(integration.type, integration.credentials, rawQuery);

                console.log(allData)

                // const allData = await fetchDataService.getAllData(integration.type, integration.credentials, JSON.parse(parametersString));

                if (!allData) throw createHttpError(404, "Unable to fetch data");

                const { fields, data } = allData;

                const response: FetchDataDTO = {
                    countOfFields: fields?.length,
                    fields: fields,
                    countOfData: data.length,
                    data: data
                }

                if (!data) throw createHttpError(404, "Unable to fetch data");

                console.log("sending data through SSE");
                res.status(200).write(`data: ${JSON.stringify(response)}\n\n`);

            }, refreshRate * 1000);


            req.on("close", () => {
                res.end();
            });

        } catch (error) {
            next(error);
        }
    }

}