import { Request, Response, NextFunction } from "express";
import { JsonValue } from "@prisma/client/runtime/library";
import { CheckConnectionService } from "../services/checkConnection.service";


interface IGetAllDataRequest extends Request {
    body: {
        integrationType: string;
        integrationCredentials: JsonValue
    }
}



export default class CheckConnectionController {
    public static checkConnection = async (req: IGetAllDataRequest, res: Response, next: NextFunction) => {
        try {
            const  { integrationType, integrationCredentials  } = req.body;
            const checkConnection = await CheckConnectionService.checkConnection(integrationType, integrationCredentials);
            res.status(200).json(checkConnection);
        } catch (error) {
            next(error);
        }
    }
}