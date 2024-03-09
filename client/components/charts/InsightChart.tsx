import { ChartDataInput } from "@/app/(root)/addInsight/page";
import { ICharts } from "@/interfaces/ICharts"
import { FetchDataResponse } from "@/app/(root)/addInsight/page";
import { LineChart } from "@/components/charts/LineChart";
import { PieChart } from "@/components/charts/PieChart";
import { ScatterChart } from "@/components/charts/ScatterChart";
import { BarGraph } from "@/components/charts/BarGraph";
import { BarChartData } from "@/components/supportedChartsList/BarChartInput";
import { PieChartData } from "@/components/supportedChartsList/PieChartInput";
import { LineChartData } from "@/components/supportedChartsList/LineChartInput";
import { MultiTypeChart } from "@/components/charts/MultiTypeChart";
import { ScatterChartData } from "@/components/supportedChartsList/ScatterChartInput";
import { TextAreaData } from "@/components/supportedChartsList/TextInput";
import { TextArea } from "@/components/charts/TextArea"
import { TableViewData } from "@/components/supportedChartsList/TableViewInput";
import { TableView } from "./TableView";

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
        try {
            const barChartUiData = chartUIData as BarChartData
            return (
                <BarGraph
                    chartData={chartData}
                    barChartUiData={barChartUiData}
                />
            )
        } catch (err) {
            console.log("Error in rendering bar chart : ", err)
        }

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
                textAreaUiData={textUiData} />
        )
    }

    else if (chartDetail.value === 'table') {
        const tableViewData = chartUIData as TableViewData
        return (
            <TableView
                tableData={chartData}
                tableViewData={tableViewData} />
        )
    }

    return (
        <div>
            <h1>Insight Chart</h1>
        </div>
    )
}
