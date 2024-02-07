import { ChartDataInput } from "@/app/(root)/addInsight/page";
import { ICharts } from "../../interfaces/ICharts";
import { FetchDataResponse } from "@/app/(root)/addInsight/page";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { ScatterChart } from "./ScatterChart";
import { BarGraph } from "./BarGraph";
import { BarChartData } from "../supportedChartsList/BarChartInput";
import { PieChartData } from "../supportedChartsList/PieChartInput";
import { LineChartData } from "../supportedChartsList/LineChartInput";
import { MultiTypeChart } from "./MultiTypeChart";
import { ScatterChartData } from "../supportedChartsList/ScatterChartInput";
import { TextAreaData } from "../supportedChartsList/TextInput";
import { TextArea } from "./TextArea";

type InsightChartProps = {
    insightData: FetchDataResponse;
    chartDetail: ICharts;
    chartUIData: ChartDataInput | undefined
}

export const InsightChart: React.FC<InsightChartProps> = ({
    insightData,
    chartDetail,
    chartUIData }) => {


    // process the data according to the chartDetail -> extract columns -> clean and format data
    // create the chart
    const chartData = insightData.data;

    if (chartDetail.value === 'bar') {
        const barChartUiData = chartUIData as BarChartData
        return (
            <BarGraph
                chartData={chartData}
                barChartUiData={barChartUiData}
            />
        )
    } else if (chartDetail.value === 'pie') {
        const pieChartUiData = chartUIData as PieChartData
        return (
            <PieChart
                chartData={chartData}
                pieChartUiData={pieChartUiData}
            />
        )
    } else if (chartDetail.value === 'line') {
        const lineChartUiData = chartUIData as LineChartData
        return (
            <LineChart
                chartData={chartData}
                lineChartUiData={lineChartUiData}
            />
        )
    } else if (chartDetail.value === 'scatter') {
        const scatterChartUiData = chartUIData as ScatterChartData
        return (
            <ScatterChart
                chartData={chartData}
                scatterChartUiData={scatterChartUiData}
            />
        )
    }

    else if (chartDetail.value === 'multi') {
        const lineChartUiData = chartUIData as LineChartData
        return (
            <MultiTypeChart
                chartData={chartData}
                xAxis={lineChartUiData.xAxisColumn}
                yAxis={lineChartUiData.yAxis} />
        )
    }

    else if (chartDetail.value === 'text') {
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
