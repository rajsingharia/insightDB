
import { TextAreaData } from '@/components/supportedChartsList/TextInput';


interface TimeBarGraphProps {
    chartData: unknown[];
    textAreaUiData: TextAreaData
}


export const TextArea: React.FC<TimeBarGraphProps> = ({
    chartData,
    textAreaUiData }) => {

    const column = textAreaUiData.column
    const prefixString = textAreaUiData.prefixString
    const suffixString = textAreaUiData.suffixString
    const color = textAreaUiData.color

    const data = chartData.map((item: any) => item[column])

    return (
        <div className='flex items-center justify-center h-full p-3 '>
            {
                data && data.length >= 0 &&
                <div className='flex flex-row'>
                    <h4 className="text-xl font-semibold">
                        {prefixString}
                    </h4>
                    <h4 className="text-xl hover:text-2xl font-semibold px-2" style={{ color: `${color}` }}>
                        {data[0]}
                    </h4>
                    <h4 className="text-xl font-semibold">
                        {suffixString}
                    </h4>
                </div>
            }
        </div>
    );
}
