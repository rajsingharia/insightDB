
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
import { ChartColors } from '../../types/ChartColors';
import { BarChartYAxisColumnData } from '../supportedChartsList/BarChartInput';

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
    xAxis: string;
    yAxis: BarChartYAxisColumnData
}


export const TimeBarGraph: React.FC<TimeBarGraphProps> = ({
    chartData,
    xAxis,
    yAxis }) => {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Bar Chart'
            },
        },
    };

    const labels = chartData.map((item: any) => {
        if (moment(item[xAxis]).isValid()) {
            return moment(item[xAxis]).format('MMM YYYY')
        }
        return item[xAxis]
    });

    let bgIdx = 0, boIdx = 0;

    const datasets = yAxis.map(({ column, alias, color, isEnabled }) => {
        if (isEnabled) {
            return {
                fill: true,
                label: alias,
                data: chartData.map((item: any) => item[column]),
                backgroundColor: color + "40",
                borderColor: color,
                borderWidth: 2
            };
        }
    });

    const data: ChartData<"bar", any[], string> = {
        labels,
        datasets: datasets as any[]
    };

    return (
        <Bar
            data={data}
            options={options}
        />
    );
}
