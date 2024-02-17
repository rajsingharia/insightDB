import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { fetchDataService } from "../services/fetchData.service";
import FetchDataDTO from "../dto/response/fetchData.dto";
import { JsonValue } from "@prisma/client/runtime/library";


interface IGetAllDataRequest extends Request {
    body: {
        rawQuery: string;
        integrationType: string;
        integrationCredentials: JsonValue
    }
}



export default class FetchDataController {
    public static getAllData = async (req: IGetAllDataRequest, res: Response, next: NextFunction) => {
        try {
            const  { rawQuery, integrationType, integrationCredentials  } = req.body;

            const allData = await fetchDataService.getAllDataFromRawQuery(integrationType, integrationCredentials, rawQuery);

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