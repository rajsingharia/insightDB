"use client"

import { ChartDataInput, FetchDataResponse } from '@/app/(root)/addInsight/page'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface BarChartInputListProps {
    setChartUIData: React.Dispatch<React.SetStateAction<ChartDataInput | undefined>>,
    insightData: FetchDataResponse | undefined
}

type PirChartColumnData = {
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

    const [pieChartData, setPieChartData] = useState<PirChartColumnData>()

    useEffect(() => {

        const randomColors = getRandomNeonColor(Number(insightData?.countOfFields))
        const pieData: PirChartColumnData = []

        var idx = 0;
        insightData?.fields.forEach((field) => {
            pieData.push(
                {
                    column: field,
                    alias: field.toUpperCase(),
                    color: randomColors[idx++],
                    isEnabled: true
                }
            )
        })

        setPieChartData(pieData)

    },[insightData])

 

    const createChart = () => {
        const temp: PieChartData = {
            type: 'pie',
            columns: pieChartData!
        }
        setChartUIData(temp)
    }

    const changeEnabled = (idx: number, enable: boolean | string) => {
        if (typeof (enable) === 'string') return
        setPieChartData(prevColumns => {
            if (prevColumns) {
                const updatedColumns = [...prevColumns];
                updatedColumns[idx] = { ...updatedColumns[idx], isEnabled: enable };
                return updatedColumns;
            }
        });
    }

    const changeAlias = (idx: number, newAlias: string) => {
        setPieChartData(prevColumns => {
            if (prevColumns) {
                const updatedColumns = [...prevColumns];
                updatedColumns[idx] = { ...updatedColumns[idx], alias: newAlias };
                return updatedColumns;
            }
        });
    }

    const changeColor = (idx: number, newColor: string) => {
        setPieChartData(prevColumns => {
            if (prevColumns) {
                const updatedColumns = [...prevColumns];
                updatedColumns[idx] = { ...updatedColumns[idx], color: newColor };
                return updatedColumns;
            }
        });
    }

    return (
        <div>
            <h4 className="scroll-m-20 text-l font-semibold tracking-tight mt-5">
                Pie Chart Columns
            </h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Enable</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Column</TableHead>
                        <TableHead>Color</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pieChartData?.map((column, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                <Checkbox
                                    checked={column.isEnabled}
                                    onCheckedChange={(e: CheckedState) => changeEnabled(idx, e)} />
                            </TableCell>
                            <TableCell className="font-medium">
                                <Input
                                    value={column.alias}
                                    onChange={(e) => changeAlias(idx, e.target.value)} />
                            </TableCell>
                            <TableCell>{column.column}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div style={{ borderColor: column.color, borderWidth: 2, background: `${column.color}40` }} className={"h-5 w-5"} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="mr-3">
                                        <SwatchesPicker onChangeComplete={(e) => changeColor(idx, e.hex)} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
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