import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PirChartColumnData } from '../supportedChartsList/PieChartInput';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    chartData: unknown[];
    chartDataColumns: PirChartColumnData;
}

export const PieChart: React.FC<PieChartProps> = ({ 
    chartData, 
    chartDataColumns}) => {

    const datasets = [
        {
            data: chartDataColumns.map((column) => {
                return chartData.map((item: any) => item[column.column])
            }),
            backgroundColor: chartDataColumns.map((value)=> value.color + '40'),
            borderColor: chartDataColumns.map((value)=> value.color + '40'),
            borderWidth: 2
        }
    ];

    console.log(datasets[0].data)

    const data: ChartData<"pie", any[], string> = {
        labels: chartDataColumns.map((value) => value.alias),
        datasets: datasets as any[]
    }

    return <Pie
        data={data}
    />;
}
