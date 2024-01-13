import createHttpError from "http-errors";
import { SupportedCharts } from "../util/constants"


export default class ChartsService {

    public static getAllCharts = () => {
        return {
            defaultChart: SupportedCharts[0],
            supportedCharts: SupportedCharts,
        }
    }

    public static getChartDetails = (chartId: number) => {
        const chartDetails = SupportedCharts.find((chart) => chart.id === chartId);
        if (!chartDetails) {
            throw createHttpError(404, "Chart not found");
        }
        return chartDetails;
    }
    static getChartDetailsForValue(chartValue: string) {
        const chartDetails = SupportedCharts.find((chart) => chart.value === chartValue);
        if (!chartDetails) {
            throw createHttpError(404, "Chart not found");
        }
        return chartDetails;
    }
}