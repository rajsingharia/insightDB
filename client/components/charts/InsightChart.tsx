import { ChartDataInput } from "@/app/(root)/addInsight/page";
import { ICharts } from "../../interfaces/ICharts";
import { FetchDataResponse } from "@/app/(root)/addInsight/page";
import { ChartColors } from "../../types/ChartColors";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { ScatterChart } from "./ScatterChart";
import { TimeBarGraph } from "./TimeBarGraph";
import { BarChartData } from "../supportedChartsList/BarChartInput";
import { useEffect } from "react";
import { PieChartData } from "../supportedChartsList/PieChartInput";
import { LineChartData } from "../supportedChartsList/LineChartInput";

type InsightChartProps = {
    insightData: FetchDataResponse;
    chartType: ICharts;
    chartUIData: ChartDataInput | undefined
}

export const InsightChart: React.FC<InsightChartProps> = ({
    insightData,
    chartType,
    chartUIData }) => {


    // process the data according to the chartType -> extract columns -> clean and format data
    // create the chart

    const chartData = insightData.data;
    const chartDataColumns: string[] = insightData.fields;

    //For Testing
    const chartColors: any = null


    if (chartType.value === 'bar') {
        const barChartUiData = chartUIData as BarChartData
        return (
            <TimeBarGraph
                chartData={chartData}
                xAxis={barChartUiData.xAxisColumn}
                yAxis={barChartUiData.yAxis}
            />
        )
    } else if (chartType.value === 'pie') {
        const pieChartUiData = chartUIData as PieChartData
        return (
            <PieChart
                chartData={chartData}
                chartDataColumns={pieChartUiData.columns}
            />
        )
    } else if (chartType.value === 'line') {
        const lineChartUiData = chartUIData as LineChartData
        return (
            <LineChart
                chartData={chartData}
                xAxis={lineChartUiData.xAxisColumn}
                yAxis={lineChartUiData.yAxis}
            />
        )
    } else if (chartType.value === 'scatter') {

        return (
            <ScatterChart
                chartData={chartData}
                chartDataColumns={chartDataColumns}
                chartColors={chartColors}
            />
        )
    }

    return (
        <div>
            <h1>Insight Chart</h1>
        </div>
    )
}
