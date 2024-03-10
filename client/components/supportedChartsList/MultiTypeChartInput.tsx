"use client"

import { ChartDataInput, FetchDataResponse } from '@/app/(root)/addInsight/page'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
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


interface MultiTypeChartInputListProps {
    chartUIData: ChartDataInput | undefined,
    setChartUIData: React.Dispatch<React.SetStateAction<ChartDataInput | undefined>>,
    insightData: FetchDataResponse | undefined
}

type MultiTypeChartYAxisColumnData = {
    column: string;
    alias: string;
    color: string;
    isEnabled: boolean;
    isFilled: boolean;
    type: string;
}[]

export interface MultiTypeChartData extends ChartDataInput {
    xAxisColumn: string;
    yAxis: MultiTypeChartYAxisColumnData
}

export const MultiTypeChartInput: React.FC<MultiTypeChartInputListProps> = ({
    chartUIData,
    setChartUIData,
    insightData }) => {

    const [xAxis, setXAxis] = useState<string>();
    const [yAxisList, setYAxisList] = useState<MultiTypeChartYAxisColumnData>()

    const currentChartUIData = chartUIData as MultiTypeChartData
    // if(currentChartUIData) {
    //     setXAxis(currentChartUIData.xAxisColumn)
    //     setYAxisList(currentChartUIData.yAxis)
    // }

    const onXAxisChange = (value: string) => {
        setXAxis(value)
        const randomColors = getRandomNeonColor(Number(insightData?.countOfFields))
        var MultiTypeChartYAxisColumnData: MultiTypeChartYAxisColumnData = []
        var idx = 0;
        insightData?.fields.forEach((field) => {
            if (field != value) {
                MultiTypeChartYAxisColumnData.push(
                    {
                        column: field,
                        alias: field.toUpperCase(),
                        color: randomColors[idx++],
                        isEnabled: true,
                        isFilled: true,
                        type: 'bar'
                    }
                )
            }
        })

        setYAxisList(MultiTypeChartYAxisColumnData)

    }

    const createChart = () => {
        if (xAxis && yAxisList) {
            const temp: MultiTypeChartData = {
                type: 'MultiType',
                xAxisColumn: xAxis!,
                yAxis: yAxisList!
            }
            console.log("temp", temp)
            setChartUIData(temp)
        }
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

    const changeType = (idx: number, type: string) => {
        setYAxisList(prevColumns => {
            if (prevColumns) {
                const updatedColumns = [...prevColumns];
                updatedColumns[idx] = { ...updatedColumns[idx], type: type };
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
            <h4 className="scroll-m-20 text-l font-semibold tracking-tight mb-5">
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
                        <TableHead>Type</TableHead>
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
                                    checked={yAxis.isFilled && yAxis.isEnabled}
                                    onCheckedChange={(e: CheckedState) => changeFilled(idx, e)} />
                            </TableCell>
                            <TableCell className="font-medium">
                                <Input
                                    value={yAxis.alias}
                                    disabled={!yAxis.isEnabled}
                                    onChange={(e) => changeAlias(idx, e.target.value)} />
                            </TableCell>
                            <TableCell>{yAxis.column}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild disabled={!yAxis.isEnabled}>
                                        <div style={{ borderColor: `${yAxis.isEnabled ? yAxis.color : '#80808040'}`, borderWidth: 2, background: `${yAxis.isEnabled ? yAxis.color : '#808080'}40` }} className={"h-5 w-5"} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="mr-3">
                                        <SwatchesPicker onChangeComplete={(e) => changeColor(idx, e.hex)} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            <TableCell>
                                <Select
                                    disabled={!yAxis.isEnabled}
                                    value={yAxis.type}
                                    onValueChange={(v) => changeType(idx, v)} >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chart Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="bar">Bar</SelectItem>
                                            <SelectItem value="line">Line</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
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

export default MultiTypeChartInput