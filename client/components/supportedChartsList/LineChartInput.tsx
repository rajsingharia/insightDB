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

    

    const onXAxisChange = (value: string) => {
        setXAxis(value)
        
        const randomColors = getRandomNeonColor(Number(insightData?.countOfFields))
        var lineChartYAxisColumnData: LineChartYAxisColumnData = []
        var idx = 0;
        insightData?.fields.forEach((field) => {
            if (field != value) {
                lineChartYAxisColumnData.push(
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

        setYAxisList(lineChartYAxisColumnData)

    }

    const createChart = () => {
        const temp: LineChartData = {
            type: 'line',
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

    const changeFilled = (idx: number, filled: boolean | string) => {
        if (typeof (filled) === 'string') return
        setYAxisList(prevColumns => {
            if (prevColumns) {
                const updatedColumns = [...prevColumns];
                updatedColumns[idx] = { ...updatedColumns[idx], isFilled: filled };
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
                        <TableHead>Filled</TableHead>
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
                            <TableCell>
                                <Checkbox
                                    checked={yAxis.isFilled}
                                    onCheckedChange={(e: CheckedState) => changeFilled(idx, e)} />
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

export default LineChartInput