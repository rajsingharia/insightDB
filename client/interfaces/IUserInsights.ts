import { ChartDataInput } from "@/app/(root)/addInsight/page";
import { GraphData } from "../types/GraphData";

export default interface IUserInsights {
    id: string;
    title: string;
    description?: string;
    integrationId: string;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    graphData: ChartDataInput;
    rawQuery: string;
    refreshRate: number;
    lastRefresh: string;
    xCoords: number;
    yCoords: number;
    height: number;
    width: number;
}

