import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

import moment from 'moment';
import { LineChartData } from '@/components/supportedChartsList/LineChartInput';


interface LineChartProps {
    chartData: unknown[];
    lineChartUiData: LineChartData
}


export const LineChart: React.FC<LineChartProps> = ({
    chartData,
    lineChartUiData }) => {

    const xAxis = lineChartUiData.xAxisColumn
    const yAxis = lineChartUiData.yAxis

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            }
        },
    };

    // only if its time axis
    const labels = chartData.map((item: any) => moment(item[xAxis]).format('MMM YYYY'));

    const datasets = yAxis
        .filter(({ isEnabled }) => isEnabled)
        .map(({ column, alias, color, isFilled }) => ({
            fill: isFilled,
            label: alias,
            data: chartData.map((item: any) => item[column]),
            backgroundColor: color + "40",
            borderColor: color,
            borderWidth: 2
        }));

    const data: ChartData<"line", any[], string> = {
        labels,
        datasets: datasets as any[]
    };

    return (
        <Line
            className='h-full w-full p-3'
            options={options}
            data={data} />
    );
}
