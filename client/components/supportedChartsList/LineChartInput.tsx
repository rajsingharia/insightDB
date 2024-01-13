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
import { CompactPicker, SwatchesPicker } from 'react-color'


interface LineChartInputListProps {
    setChartUIData: React.Dispatch<React.SetStateAction<ChartDataInput | undefined>>,
    insightData: FetchDataResponse | undefined,
}

export type LineChartYAxisColumnData = {
    column: string;
    alias: string;
    color: string;
    isEnabled: boolean;
    isFilled: boolean;
}[]

export interface LineChartData extends ChartDataInput {
    xAxisColumn: string;
    yAxis: LineChartYAxisColumnData
}

export const LineChartInput: React.FC<LineChartInputListProps> = ({
    setChartUIData,
    insightData }) => {

    const [xAxis, setXAxis] = useState<string>();
    const [yAxisList, setYAxisList] = useState<LineChartYAxisColumnData>()

    const randomColors = getRandomNeonColor(Number(insightData?.countOfFields))

    const onXAxisChange = (value: string) => {
        setXAxis(value)

        var temp: LineChartYAxisColumnData = []

        var idx = 0;

        insightData?.fields.forEach((field) => {
            if (field != value) {
                temp.push(
                    {
                        column: field,
                        alias: field.toUpperCase(),
                        color: randomColors[idx++],
                        isEnabled: true,
                        isFilled: true
                    }
                )
            }
        })

        setYAxisList(temp)

    }

    const createChart = () => {
        const temp: LineChartData = {
            type: 'line',
            xAxisColumn: xAxis!,
            yAxis: yAxisList!
        }
        setChartUIData(temp)
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
            <h4 className="scroll-m-20 text-l font-semibold tracking-tight mt-5">
                Y Axis
            </h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Column</TableHead>
                        <TableHead>Color</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {yAxisList?.map((yAxis, idx) => (
                        <TableRow key={idx}>
                            <TableCell className="font-medium">{yAxis.alias}</TableCell>
                            <TableCell>{yAxis.column}</TableCell>
                            <TableCell>
                                {/* <CompactPicker/> */}
                                <div style={{ borderColor: yAxis.color, borderWidth: 2, background: `${yAxis.color}40` }} className={"h-5 w-5"} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button className="mt-2" onClick={createChart}>
                Visualize
            </Button>
        </div>
    )
}

export default LineChartInput