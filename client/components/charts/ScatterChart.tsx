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
import { ScatterChartData } from '../supportedChartsList/scatterChartInput';

ChartJS.register(LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend);

interface ScatterChartProps {
    chartData: unknown[];
    scatterChartUiData: ScatterChartData
}

export const ScatterChart: React.FC<ScatterChartProps> = ({
    chartData,
    scatterChartUiData }) => {

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const labels = [scatterChartUiData.xAxisColumn, scatterChartUiData.yAxisColumn]

    const datasets = chartData.map((item: any) => {
        return {
            label: `(${labels[0]},${labels[1]})`,
            data: [{
                x: item[scatterChartUiData.xAxisColumn],
                y: item[scatterChartUiData.yAxisColumn]
            }],
            backgroundColor: scatterChartUiData.color + "40",
            borderColor: scatterChartUiData.color,
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
