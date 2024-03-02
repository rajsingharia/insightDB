import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { InsightService } from "../services/insight.service";
import { InsightDTO } from "../dto/request/insight.dto";
import { validate } from "class-validator";


// interface IGetAllInsightRequest extends Request {
//     body: {
//         userId: string;
//         dashboardId: string;
//     }
// }

interface IGetInsightWithIdRequest extends Request {
    params: {
        id: string;
    }
}

// interface IAddInsightRequest extends Request {
//     body: {
//         userId: string;
//         insight: InsightDTO;
//     }
// }

interface IUpdateInsightRequest extends Request {
    body: {
        userId: string;
        insight: InsightDTO;
    },
    params: {
        id: string
    }
}


interface IUpdateInsightLayoutRequest extends Request {
    body: {
        userId: string;
        layout: {
            x: number;
            y: number;
            h: number;
            w:number
        }
    },
    params: {
        id: string;
    }
}


export class InsightController {

    public static getInsightsFromDefaultDashboard = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const organisationId = req.body.organisationId;
            if(!organisationId) throw createHttpError("organisationId Id Required")

            const data = await InsightService.getInsightsFromDefaultDashboard(organisationId);
            if (!data) throw createHttpError(404, "Unable to get insights");
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }


    public static getInsights = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const dashboardId = req.params.id;
            if(!dashboardId) throw createHttpError("organisationId Id Required")

            const data = await InsightService.getInsightsFromDashboardId(dashboardId);
            if (!data) throw createHttpError(404, "Unable to get insights");
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    public static getInsightWithId = async(req: IGetInsightWithIdRequest, res: Response, next: NextFunction) => {
        try {
            const insightId = req.params.id;
            if(!insightId) throw createHttpError(400, "Provide insight Id");
            const data = await InsightService.getInsightWithId(insightId);
            if (!data) throw createHttpError(404, "Unable to get insights");
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    public static deleteInsightWithId = async(req: IGetInsightWithIdRequest, res: Response, next: NextFunction) => {
        try {
            const insightId = req.params.id;
            if(!insightId) throw createHttpError(400, "Provide insight Id");
            const data = await InsightService.deleteInsightWithId(insightId);
            if (!data) throw createHttpError(404, "Unable to get insights");
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    public static duplicateInsightWithId = async(req: IGetInsightWithIdRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.body.userId;
            const insightId = req.params.id;
            if(!insightId) throw createHttpError(400, "Provide insight Id");
            const insight = await InsightService.getInsightWithId(insightId);
            if (!insight) throw createHttpError(404, "Unable to get insights");
            const duplicateInsight = new InsightDTO()
            duplicateInsight.title = insight.title
            duplicateInsight.description = insight.description?? undefined
            duplicateInsight.integrationId = insight.integrationId
            duplicateInsight.graphData = insight.graphData
            duplicateInsight.rawQuery = insight.rawQuery
            duplicateInsight.refreshRate = insight.refreshRate
            const createdInsightId = await InsightService.addInsight(userId, duplicateInsight);
            res.status(200).json(createdInsightId);
        } catch (error) {
            next(error);
        }
    }

    public static addInsight = async(req: Request, res: Response, next: NextFunction) => {
        try{
            const dashboardId = req.body.dashboardId;
            const insight = req.body.insight;

            if(!dashboardId) throw createHttpError("Dashboard Id Required")

            const validationErrors = await validate(insight);
            if (validationErrors.length > 0) {
                throw createHttpError(400, `Validation error: ${validationErrors}`);
            }

            const createdInsightId = await InsightService.addInsight(dashboardId, insight);
            if (!createdInsightId) throw createHttpError(404, "Unable to create insight");
            res.status(200).json(createdInsightId);
        } catch (error) {
            next(error);
        }
    }

    public static updateInsight = async(req: IUpdateInsightRequest, res: Response, next: NextFunction) => {
        try{
            const insight = req.body.insight;
            const insightId = req.params.id

            if(!insightId) throw createHttpError('Insight Id not provided!!!')

            const validationErrors = await validate(insight);
            if (validationErrors.length > 0) {
                throw createHttpError(400, `Validation error: ${validationErrors}`);
            }

            const createdInsightId = await InsightService.updateInsight(insightId, insight);
            if (!createdInsightId) throw createHttpError(404, "Unable to create insight");
            res.status(200).json(createdInsightId);
        } catch (error) {
            next(error);
        }
    }

    public static updateInsightLayout = async(req: IUpdateInsightLayoutRequest, res: Response, next: NextFunction) => {
        try{
            const insightId = req.params.id;
            const layout = req.body.layout

            const updateInsightId = await InsightService.updateInsightLayout(insightId, layout.x, layout.y, layout.h, layout.w);
            if (!updateInsightId) throw createHttpError(404, "Unable to update insight");
            res.status(200).json(updateInsightId);
        } catch (error) {
            next(error);
        }
    }

}