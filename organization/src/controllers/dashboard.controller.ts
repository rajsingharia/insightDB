import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { DashboardService } from "../services/dashboard.service";

export class DashboardController {


    public static async getDefaultDashboard(req: Request, res: Response, next: NextFunction) {
        try {
            const organisationId = req.body.organisationId;
            const defaultDashboardId = await DashboardService.getDefaultDashboardIdFromorganisation(organisationId);
            if (!defaultDashboardId) throw createHttpError.NotFound("Default Dashboards not found");
            res.status(200).json(defaultDashboardId);
        } catch (error) {
            next(error);
        }
    }

    public static async getAllDashboards(req: Request, res: Response, next: NextFunction) {
        try {
            const organisationId = req.body.organisationId;
            if(!organisationId) throw createHttpError("No organisation Id in token")
            const allDashboards = await DashboardService.getAllDashboardsFromorganisation(organisationId);
            if (!allDashboards) throw createHttpError.NotFound("Dashboards not found");
            res.status(200).json(allDashboards);
        } catch (error) {
            next(error);
        }
    }

    public static async createDashboard(req: Request, res: Response, next: NextFunction) {
        try {
            const organisationId = req.body.organisationId;
            if(!organisationId) throw createHttpError("No organisation Id in token")
            const dashBoard = req.body.dashboard;
            const dashboard = await DashboardService.createDashboard(organisationId, dashBoard);
            if (!dashboard) throw createHttpError(404, "Dashboard not able to create");
            res.status(200).json(dashboard);
        } catch (error) {
            next(error);
        }
    }

    public static async makeDashboardDefault(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const organisationId = req.body.organisationId;
            if(!organisationId) throw createHttpError("No organisation Id in token")
            const dashboardId = req.body.dashboardId;
            const dashboard = await DashboardService.makeDashboardDefault(organisationId, dashboardId);
            if (!dashboard) throw createHttpError(404, "Unable to make Dashboard Default");
            res.status(201).json(dashboard);
        } catch (error) {
            next(error);
        }
    }

    public static async addUserForWritePermission(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const dashboardId = req.params.dashboardId;

            const dashboard = await DashboardService.addUserForWritePermission(userId, dashboardId)
            if (!dashboard) throw createHttpError(404, "Unable to add user for write permission to this Dashboard");
            res.status(201).json(dashboard);
        } catch (error) {
            next(error);
        }
    }

}