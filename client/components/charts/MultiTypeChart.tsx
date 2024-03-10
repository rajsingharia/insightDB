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
import { Chart } from 'react-chartjs-2';

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
import { LineChartYAxisColumnData } from '@/components/supportedChartsList/LineChartInput';
import { MultiTypeChartData } from '../supportedChartsList/MultiTypeChartInput';


interface MultiTypeChartProps {
    chartData: unknown[];
    multiTypeChartUiData: MultiTypeChartData
}


export const MultiTypeChart: React.FC<MultiTypeChartProps> = ({
    chartData,
    multiTypeChartUiData }) => {

    const xAxis = multiTypeChartUiData.xAxisColumn
    const yAxis = multiTypeChartUiData.yAxis


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
        .map(({ column, alias, color, isFilled, type }) => ({
            type: type,
            fill: isFilled,
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
        <Chart
            type='bar'
            options={options}
            data={data} />
    );
}
