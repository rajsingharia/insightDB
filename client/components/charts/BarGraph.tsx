
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import { BarChartData } from "@/components/supportedChartsList/BarChartInput"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface TimeBarGraphProps {
    chartData: unknown[];
    barChartUiData: BarChartData
}


export const BarGraph: React.FC<TimeBarGraphProps> = ({
    chartData,
    barChartUiData }) => {

    const xAxis = barChartUiData.xAxisColumn
    const yAxis = barChartUiData.yAxis

    console.log("yAxis", yAxis)

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            }
        },
    };

    const labels = chartData.map((item: any) => {
        if (moment(item[xAxis]).isValid()) {
            return moment(item[xAxis]).format('MMM YYYY')
        }
        return item[xAxis]
    });


    const datasets = yAxis
        .filter(({ isEnabled }) => isEnabled)
        .map(({ column, alias, color }) => ({
            fill: true,
            label: alias,
            data: chartData.map((item: any) => item[column]),
            backgroundColor: color + '40',
            borderColor: color,
            borderWidth: 2,
        }));

    const data: ChartData<"bar", any[], string> = {
        labels,
        datasets: datasets as any[]
    };

    return (
        <Bar
            className='h-full w-full p-3'
            data={data}
            options={options}
        />
    );
}
