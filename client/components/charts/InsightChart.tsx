import { ChartDataInput } from "@/app/(root)/addInsight/page";
import { ICharts } from "../../interfaces/ICharts";
import { FetchDataResponse } from "@/app/(root)/addInsight/page";
import { ChartColors } from "../../types/ChartColors";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { ScatterChart } from "./ScatterChart";
import { BarGraph } from "./BarGraph";
import { BarChartData } from "../supportedChartsList/BarChartInput";
import { useEffect } from "react";
import { PieChartData } from "../supportedChartsList/PieChartInput";
import { LineChartData } from "../supportedChartsList/LineChartInput";
import { MultiTypeChart } from "./MultiTypeChart";
import { ScatterChartData } from "../supportedChartsList/ScatterChartInput";
import { TextAreaData } from "../supportedChartsList/TextInput";
import { TextArea } from "./TextArea";

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
            <BarGraph
                chartData={chartData}
                barChartUiData={barChartUiData}
            />
        )
    } else if (chartType.value === 'pie') {
        const pieChartUiData = chartUIData as PieChartData
        return (
            <PieChart
                chartData={chartData}
                pieChartUiData={pieChartUiData}
            />
        )
    } else if (chartType.value === 'line') {
        const lineChartUiData = chartUIData as LineChartData
        return (
            <LineChart
                chartData={chartData}
                lineChartUiData={lineChartUiData}
            />
        )
    } else if (chartType.value === 'scatter') {
        const scatterChartUiData = chartUIData as ScatterChartData
        return (
            <ScatterChart
                chartData={chartData}
                scatterChartUiData={scatterChartUiData}
            />
        )
    }

    else if (chartType.value === 'multi') {
        const lineChartUiData = chartUIData as LineChartData
        return (
            <MultiTypeChart
                chartData={chartData}
                xAxis={lineChartUiData.xAxisColumn}
                yAxis={lineChartUiData.yAxis} />
        )
    }

    else if (chartType.value === 'text') {
        const textUiData = chartUIData as TextAreaData
        return (
            <TextArea
                chartData={chartData}
                textAreaUiData={textUiData}/>
        )
    }

    return (
        <div>
            <h1>Insight Chart</h1>
        </div>
    )
}
