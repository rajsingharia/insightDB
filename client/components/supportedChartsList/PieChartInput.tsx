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


interface BarChartInputListProps {
    setChartUIData: React.Dispatch<React.SetStateAction<ChartDataInput | undefined>>,
    insightData: FetchDataResponse | undefined
}

export type PirChartColumnData = {
    column: string;
    alias: string;
    color: string;
    isEnabled: boolean;
}[]

export interface PieChartData extends ChartDataInput {
    columns: PirChartColumnData
}

export const PieChartInput: React.FC<BarChartInputListProps> = ({
    setChartUIData,
    insightData }) => {


    const randomColors = getRandomNeonColor(Number(insightData?.countOfFields))

    var pieChartData: PirChartColumnData = []

    var idx = 0;

    insightData?.fields.forEach((field) => {
        pieChartData.push(
            {
                column: field,
                alias: field.toUpperCase(),
                color: randomColors[idx++],
                isEnabled: true
            }
        )
    })

    const createChart = () => {
        const temp: PieChartData = {
            type: 'pie',
            columns: pieChartData
        }
        setChartUIData(temp)
    }

    return (
        <div>
            <h4 className="scroll-m-20 text-l font-semibold tracking-tight mt-5">
                Pie Chart Columns
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
                    {pieChartData?.map((column, idx) => (
                        <TableRow key={idx}>
                            <TableCell className="font-medium">{column.alias}</TableCell>
                            <TableCell>{column.column}</TableCell>
                            <TableCell>
                                {/* <CompactPicker/> */}
                                <div style={{ borderColor: column.color, borderWidth: 2, background: `${column.color}40` }} className={"h-5 w-5"} />
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

export default PieChartInput