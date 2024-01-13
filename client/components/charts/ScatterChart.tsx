/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    ChartData
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { ChartColors } from '../../types/ChartColors';

ChartJS.register(LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend);

interface ScatterChartProps {
    chartData: unknown[];
    chartDataColumns: string[];
    chartColors: ChartColors;
}

export const ScatterChart: React.FC<ScatterChartProps> = ({ chartData, chartDataColumns, chartColors}) => {

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const labels = chartDataColumns;
    let bgIdx = 0, boIdx = 0;
    const datasets = chartData.map((item: any) => {
        return {
            label: `(${labels[0]},${labels[1]})`,
            data: [{
                x: item[chartDataColumns[0]],
                y: item[chartDataColumns[1]]
            }],
            backgroundColor: chartColors.backgroundColor[bgIdx++],
            borderColor: chartColors.borderColor[boIdx++],
            borderWidth: 2
        }
    });

    const data: ChartData<"scatter", any[], string> = {
        labels,
        datasets: datasets as any[]
    }

    return (
        <Scatter
            options={options}
            data={data} />
    );
}
