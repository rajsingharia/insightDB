import { Insight } from "@prisma/client";
import prisma from "../config/database.config";
import { InsightDTO } from "../dto/request/insight.dto";
import createHttpError from "http-errors";


export class InsightService {

    private static prismaClient = prisma.getInstance();

    public static async getInsightsFromDashboardId(dashboardId: string): Promise<Insight[]> {
        const insights = await this.prismaClient.insight.findMany({   
            where: {
                dashboardId: dashboardId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return insights;
    }

    public static async getInsightsFromDefaultDashboard(organizationId: string) {

        const defaultDashboard = await this.prismaClient.organisation.findUniqueOrThrow({
            where: {
                id: organizationId
            },
            include: {
                defaultDashboard: true
            }
        })

        if(!defaultDashboard || !defaultDashboard.defaultDashboardId) throw createHttpError(404, "No Default Dashboard found for the Organization");

        const insights = await this.prismaClient.insight.findMany({   
            where: {
                dashboardId: defaultDashboard.defaultDashboardId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return insights;
    }

    public static async getInsightWithId(insightId: string): Promise<Insight | null> {
        const insights = await this.prismaClient.insight.findUnique({   
            where: {
                id: insightId
            }
        });
        return insights;
    }

    public static async deleteInsightWithId(insightId: string): Promise<Insight | null> {
        const insights = await this.prismaClient.insight.delete({   
            where: {
                id: insightId
            }
        });
        return insights;
    }


    public static async addInsight(dashboardId: string, insight: InsightDTO): Promise<string> {


        const newInsight = await this.prismaClient.insight.create({
            data: {
                title: insight.title,
                description: insight.description,
                integrationId: insight.integrationId,
                graphData: insight.graphData!,
                rawQuery: insight.rawQuery!,
                refreshRate: insight.refreshRate!,
                dashboardId: dashboardId
            }
        });

        return newInsight.id;
        
    }

    public static async updateInsight(insightId: string, insight: InsightDTO): Promise<string> {

        const newInsight = await this.prismaClient.insight.update({
            where: {
                id: insightId
            },
            data: {
                title: insight.title,
                description: insight.description,
                integrationId: insight.integrationId,
                graphData: insight.graphData!,
                rawQuery: insight.rawQuery!,
                refreshRate: insight.refreshRate!
            }
        });

        return newInsight.id;
        
    }

    public static async getInsightById(insightId: string): Promise<Insight | null> {
        const insight = await this.prismaClient.insight.findFirst({
            where: {
                id: insightId
            }
        });
        return insight;
    }

    public static async updateInsightLayout(insightId: string, x: number, y: number, h: number, w:number): Promise<string> {

        const newInsight = await this.prismaClient.insight.update({
            where: {
                id: insightId
            },
            data: {
                xCoords: x,
                yCoords: y,
                height: h,
                width: w
            }
        });

        return newInsight.id;
        
    }

}