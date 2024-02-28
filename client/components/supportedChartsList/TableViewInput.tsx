"use client"

import { ChartDataInput, FetchDataResponse } from '@/app/(root)/addInsight/page'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckedState } from '@radix-ui/react-checkbox'
import { Input } from '@/components/ui/input'


interface TableViewInputListProps {
    setChartUIData: React.Dispatch<React.SetStateAction<ChartDataInput | undefined>>,
    insightData: FetchDataResponse | undefined
}

type TableViewColumnData = {
    column: string;
    alias: string;
    isEnabled: boolean;
}[]

export interface TableViewData extends ChartDataInput {
    tableView: TableViewColumnData
}

export const TableViewInput: React.FC<TableViewInputListProps> = ({
    setChartUIData,
    insightData }) => {

    const [tableViewList, setTableViewList] = useState<TableViewColumnData>()

    useEffect(() => {
        const barChartYAxisColumnData: TableViewColumnData = []
        insightData?.fields.forEach((field) => {
            barChartYAxisColumnData.push(
                {
                    column: field,
                    alias: field.toUpperCase(),
                    isEnabled: true
                }
            )
        })

        setTableViewList(barChartYAxisColumnData)
    }, [])


    const createChart = () => {
        const temp: TableViewData = {
            type: 'table',
            tableView: tableViewList!!
        }
        setChartUIData(temp)
    }

    const changeEnabled = (idx: number, enable: boolean | string) => {
        if (typeof (enable) === 'string') return
        setTableViewList(prevColumns => {
            if (prevColumns) {
                const updatedColumns = [...prevColumns];
                updatedColumns[idx] = { ...updatedColumns[idx], isEnabled: enable };
                return updatedColumns;
            }
        });
    }

    const changeAlias = (idx: number, newAlias: string) => {
        setTableViewList(prevColumns => {
            if (prevColumns) {
                const updatedColumns = [...prevColumns];
                updatedColumns[idx] = { ...updatedColumns[idx], alias: newAlias };
                return updatedColumns;
            }
        });
    }


    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Enable</TableHead>
                        <TableHead>Alias</TableHead>
                        <TableHead>Column</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableViewList?.map((yAxis, idx) => (
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

export default TableViewInput