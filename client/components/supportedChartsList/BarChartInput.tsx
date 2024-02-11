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

type BarChartYAxisColumnData = {
    column: string;
    alias: string;
    color: string;
    isEnabled: boolean;
}[]

export interface BarChartData extends ChartDataInput {
    xAxisColumn: string;
    yAxis: BarChartYAxisColumnData
}

export const BarChartInput: React.FC<BarChartInputListProps> = ({
    setChartUIData,
    insightData }) => {

    const [xAxis, setXAxis] = useState<string>();
    const [yAxisList, setYAxisList] = useState<BarChartYAxisColumnData>()

    const onXAxisChange = (value: string) => {
        setXAxis(value)
        const randomColors = getRandomNeonColor(Number(insightData?.countOfFields))
        var barChartYAxisColumnData: BarChartYAxisColumnData = []
        var idx = 0;
        insightData?.fields.forEach((field) => {
            if (field != value) {
                barChartYAxisColumnData.push(
                    {
                        column: field,
                        alias: field.toUpperCase(),
                        color: randomColors[idx++],
                        isEnabled: true
                    }
                )
            }
        })

        setYAxisList(barChartYAxisColumnData)

    }

    const createChart = () => {
        const temp: BarChartData = {
            type: 'bar',
            xAxisColumn: xAxis!,
            yAxis: yAxisList!
        }
        setChartUIData(temp)
    }

    const changeEnabled = (idx: number, enable: boolean | string) => {
        if (typeof (enable) === 'string') return
        setYAxisList(prevColumns => {
            if (prevColumns) {
                const updatedColumns = [...prevColumns];
                updatedColumns[idx] = { ...updatedColumns[idx], isEnabled: enable };
                return updatedColumns;
            }
        });
    }

    const changeAlias = (idx: number, newAlias: string) => {
        setYAxisList(prevColumns => {
            if (prevColumns) {
                const updatedColumns = [...prevColumns];
                updatedColumns[idx] = { ...updatedColumns[idx], alias: newAlias };
                return updatedColumns;
            }
        });
    }

    const changeColor = (idx: number, newColor: string) => {
        setYAxisList(prevColumns => {
            if (prevColumns) {
                const updatedColumns = [...prevColumns];
                updatedColumns[idx] = { ...updatedColumns[idx], color: newColor };
                return updatedColumns;
            }
        });
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
                        <TableHead>Enable</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Column</TableHead>
                        <TableHead>Color</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {yAxisList?.map((yAxis, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                <Checkbox
                                    checked={yAxis.isEnabled}
                                    onCheckedChange={(e: CheckedState) => changeEnabled(idx, e)} />
                            </TableCell>
                            <TableCell className="font-medium">
                                <Input
                                    value={yAxis.alias}
                                    onChange={(e) => changeAlias(idx, e.target.value)} />
                            </TableCell>
                            <TableCell>{yAxis.column}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div style={{ borderColor: yAxis.color, borderWidth: 2, background: `${yAxis.color}40` }} className={"h-5 w-5"} />
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

export default BarChartInput