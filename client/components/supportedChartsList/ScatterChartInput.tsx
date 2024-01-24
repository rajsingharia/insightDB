"use client"

import { ChartDataInput, FetchDataResponse } from '@/app/(root)/addInsight/page'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button'
import { getRandomNeonColor } from '@/utils/Helper'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { SwatchesPicker } from 'react-color'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Input } from '../ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface ScatterChartInputListProps {
    setChartUIData: React.Dispatch<React.SetStateAction<ChartDataInput | undefined>>,
    insightData: FetchDataResponse | undefined
}

export interface ScatterChartData extends ChartDataInput {
    xAxisColumn: string;
    yAxisColumn: string;
    color: string;
}

export const ScatterChartInput: React.FC<ScatterChartInputListProps> = ({
    setChartUIData,
    insightData }) => {

    const [xAxis, setXAxis] = useState<string>();
    const [yAxis, setYAxis] = useState<string>();
    const [color, setColor] = useState<string>();

    const onXAxisChange = (value: string) => {
        setXAxis(value)
    }

    const onYAxisChange = (value: string) => {
        setYAxis(value)
    }

    const createChart = () => {
        const temp: ScatterChartData = {
            type: 'Scatter',
            xAxisColumn: xAxis!,
            yAxisColumn: yAxis!,
            color: color!
        }
        setChartUIData(temp)
    }


    const changeColor = (newColor: string) => {
        setColor(newColor)
    }

    return (
        <div>
            <h4 className="scroll-m-20 text-l font-semibold tracking-tight">
                X Axis
            </h4>
            <Select onValueChange={(value) => onXAxisChange(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="xAxis" />
                </SelectTrigger>
                <SelectContent>
                    {
                        insightData?.fields.map((field, index) => {
                            return (
                                <SelectItem
                                    key={index}
                                    value={field}>
                                    {field}
                                </SelectItem>
                            )
                        })
                    }
                </SelectContent>
            </Select>
            <h4 className="scroll-m-20 text-l font-semibold tracking-tight">
                Y Axis
            </h4>
            <Select onValueChange={(value) => onYAxisChange(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="xAxis" />
                </SelectTrigger>
                <SelectContent>
                    {
                        insightData?.fields.map((field, index) => {
                            return (
                                <SelectItem
                                    key={index}
                                    value={field}>
                                    {field}
                                </SelectItem>
                            )
                        })
                    }
                </SelectContent>
            </Select>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div style={{ borderColor: color, borderWidth: 2, background: `${color}40` }} className={"h-5 w-5"} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-3">
                    <SwatchesPicker onChangeComplete={(e) => changeColor(e.hex)} />
                </DropdownMenuContent>
            </DropdownMenu>
            <Button className="mt-2" onClick={createChart}>
                Visualize
            </Button>
        </div>
    )
}

export default ScatterChartInput