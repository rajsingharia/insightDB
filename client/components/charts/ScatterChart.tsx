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
import { ScatterChartData } from '@/components/supportedChartsList/ScatterChartInput';

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
            label: `(${item[scatterChartUiData.xAxisColumn]},${item[scatterChartUiData.yAxisColumn]})`,
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
            className='h-full w-full p-3'
            options={options}
            data={data} />
    );
}
