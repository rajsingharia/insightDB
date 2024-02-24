import prisma from "../config/database.config";
import createHttpError from "http-errors";
import { DashboardDTO } from "../dto/request/dashboard.dto";


export class DashboardService {

    private static prismaClient = prisma.getInstance();

    public static getDefaultDashboardIdFromorganisation = async (organisationId: string) => {
        const organisation = await this.prismaClient.organisation.findUniqueOrThrow({
            where: {
                id: organisationId
            }
        });
        if (!organisation.defaultDashboardId) throw new createHttpError.NotFound("No Default dashboard found for the given organisation ID");
        return organisation.defaultDashboardId;
    }

    public static getAllDashboardsFromorganisation = async (organisationId: string) => {
        const organisation = await this.prismaClient.organisation.findUniqueOrThrow({
            where: {
                id: organisationId
            },
            include: {
                dashboards: true
            }
        });
        if (!organisation?.dashboards) throw new createHttpError.NotFound("No dashboards found for the given organisation ID");
        return organisation.dashboards;
    }

    public static createDashboard = async (organisationId: string, dashBoard: DashboardDTO) => {


        const allDashboards = await this.getAllDashboardsFromorganisation(organisationId)

        let isDefaultDashboard = false
        if (!allDashboards || allDashboards.length == 0) isDefaultDashboard = true

        const dashboardCreated = await this.prismaClient.dashboard.create({
            data: {
                title: dashBoard.title,
                description: dashBoard.description,
                orgId: organisationId
            }
        });

        if (!dashboardCreated) throw createHttpError("Unable to create dashboard")

        let organisation = await this.prismaClient.organisation.update({
            where: {
                id: organisationId
            },
            data: {
                dashboards: {
                    connect: { id: dashboardCreated.id }
                }
            }
        })

        if (isDefaultDashboard) {
            organisation = await this.makeDashboardDefault(organisationId, dashboardCreated.id);
        }

        return organisation;
    }

    public static makeDashboardDefault = async (organisationId: string, dashboardId: string) => {
        const organisation = await this.prismaClient.organisation.update({
            where: {
                id: organisationId
            },
            data: {
                defaultDashboardId: dashboardId
            }
        });
        return organisation;
    }

    public static removeDashboardFromOrganisation = async (dashboardId: string, organisationId: string) => {
        const organisation = await this.prismaClient.organisation.update({
            where: {
                id: organisationId
            },
            data: {
                defaultDashboardId: dashboardId
            }
        });
        return organisation;
    }

    public static addUserForWritePermission = async (userId: string, dashboardId: string) => {
        const dashboard = await this.prismaClient.dashboard.update({
            where: {
                id: dashboardId
            },
            data: {
                writePermissionUsers: {
                    connect: { id: userId }
                }
            }
        })
        return dashboard
    }

}
