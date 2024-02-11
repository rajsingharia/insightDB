import prisma from "../config/database.config";
import createHttpError from "http-errors";
import { DashboardDTO } from "../dto/request/dashboard.dto";


export class DashboardService {

    private static prismaClient = prisma.getInstance();

    public static getAllDashboardsFromOrganization = async (organizationId: string) => {
        const organization = await this.prismaClient.organisation.findUniqueOrThrow({
            where: {
                id: organizationId
            },
            include: {
                dashboards: true
            }
        });
        if (!organization?.dashboards) throw new createHttpError.NotFound("No dashboards found for the given Organization ID");
        return organization.dashboards;
    }

    public static createDashboard = async (organizationId: string, dashBoard: DashboardDTO) => {


        const allDashboards = await this.getAllDashboardsFromOrganization(organizationId)

        let isDefaultDashboard = false
        if (!allDashboards || allDashboards.length == 0) isDefaultDashboard = true

        const dashboardCreated = await this.prismaClient.dashboard.create({
            data: {
                title: dashBoard.title,
                description: dashBoard.description,
            }
        });

        if (!dashboardCreated) throw createHttpError("Unable to create dashboard")

        let organization = await this.prismaClient.organisation.update({
            where: {
                id: organizationId
            },
            data: {
                dashboards: {
                    connect: { id: dashboardCreated.id }
                }
            }
        })

        if (isDefaultDashboard) {
            organization = await this.makeDashboardDefault(organizationId, dashboardCreated.id);
        }

        return organization;
    }

    public static makeDashboardDefault = async (organizationId: string, dashboardId: string) => {
        const organization = await this.prismaClient.organisation.update({
            where: {
                id: organizationId
            },
            data: {
                defaultDashboardId: dashboardId
            }
        });
        return organization;
    }

    public static removeDashboardFromOrganisation = async (dashboardId: string, organizationId: string) => {
        const organization = await this.prismaClient.organisation.update({
            where: {
                id: organizationId
            },
            data: {
                defaultDashboardId: dashboardId
            }
        });
        return organization;
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
