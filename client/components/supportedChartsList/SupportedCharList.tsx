"use client"


import React from 'react'
import { ICharts } from '../../interfaces/ICharts'
import { Card } from '../ui/card'
import { SupportedCharts } from '@/utils/Constants'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Image from 'next/image'
import { ChartDataInput, FetchDataResponse } from '@/app/(root)/addInsight/page'
import BarChartInput from './BarChartInput'
import PieChartInput from './PieChartInput'
import LineChartInput from './LineChartInput'
import ScatterChartInput from './scatterChartInput'

interface SupportedCharListProps {
    selectedChart: ICharts,
    setSelectedChart: (chart: ICharts) => void,
    setChartUIData: React.Dispatch<React.SetStateAction<ChartDataInput | undefined>>,
    insightData: FetchDataResponse | undefined
}

export const SupportedCharList: React.FC<SupportedCharListProps> = ({
    selectedChart,
    setSelectedChart,
    setChartUIData,
    insightData }) => {


    const getChartData = (chartType: string) => {
        if (chartType === 'bar') {
            return (
                <BarChartInput
                    setChartUIData={setChartUIData}
                    insightData={insightData} />
            )
        }
        else if (chartType === 'pie') {
            return (
                <PieChartInput
                    setChartUIData={setChartUIData}
                    insightData={insightData} />
            )
        }
        else if (chartType === 'line') {
            return (
                <LineChartInput
                    setChartUIData={setChartUIData}
                    insightData={insightData} />
            )
        }
        else if (chartType === 'scatter') {
            return (
                <ScatterChartInput
                    setChartUIData={setChartUIData}
                    insightData={insightData} />

            )
        }
    }

    return (
        // scrollable list of supported charts
        <div className='flex flex-col w-full gap-2'>
            {
                //Title : select chart and their properties
            }
            {
                SupportedCharts.map((chart, index) => {
                    return (
                        <Popover key={index}>
                            <PopoverTrigger>
                                <Card
                                    key={index}
                                    onClick={() => {
                                        setChartUIData(undefined) // resetting chartUI
                                        setSelectedChart(chart)
                                    }}>
                                    <div className={chart.value === selectedChart.value ?
                                        'border-4 border-purple-500 bg-purple-600 bg-opacity-40 rounded-lg' :
                                        'border-4 border-transparent'}>
                                        <div className='flex flex-row items-center justify-center p-1'>
                                            <span className={chart.value === selectedChart.value ?
                                                'text-sm font-mono font-extrabold mr-2 text-center text-white' :
                                                'text-sm font-mono font-extrabold mr-2 text-center'}>
                                                {chart?.name}
                                            </span>
                                            <img
                                                src={chart.icon}
                                                alt={chart.name}
                                                className="h-5 w-5" />
                                        </div>
                                    </div>
                                </Card>
                            </PopoverTrigger>
                            <PopoverContent className='w-[400px]'>
                                {
                                    getChartData(chart.value)
                                }
                            </PopoverContent>
                        </Popover>
                    )
                })
            }
        </div>
    )
}
