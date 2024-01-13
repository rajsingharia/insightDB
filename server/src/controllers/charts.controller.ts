import { NextFunction, Request, Response } from "express";
import ChartsService from "../services/charts.service";
import { QueryParameterService } from "../services/queryParameter.service";
import { DataBaseType } from "../util/constants";


interface IGetChartQueriesRequest extends Request {
    params: {
        chartId: string;
    }
}

interface IGetChartDetailsForValueRequest extends Request {
    params: {
        chartValue: string;
    }
}

export default class ChartsController {
    public static getAllCharts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await ChartsService.getAllCharts();
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public static getChartQueries = async (req: IGetChartQueriesRequest, res: Response, next: NextFunction) => {
        try {
            const chartId = Number(req.params.chartId);
            if(isNaN(chartId) || chartId == 0) throw new Error("Invalid chart id");
            const chartDetails = await ChartsService.getChartDetails(chartId);
            const response = await QueryParameterService.getQueryInfo(DataBaseType.POSTGRES_QL);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public static getChartDetailsForValue = async (req: IGetChartDetailsForValueRequest, res: Response, next: NextFunction) => {
        try {
            const chartValue = req.params.chartValue;
            const response = await ChartsService.getChartDetailsForValue(chartValue);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}