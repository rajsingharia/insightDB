
import React, { useEffect, useState } from 'react'
import { format } from 'sql-formatter';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Card } from "@/components/ui/card"
import { PlusCircleIcon } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { Textarea } from "@/components/ui/textarea"
import { TrashIcon } from '@radix-ui/react-icons';

type QueryInputProps = {
    rawQuery: string;
    setRawQuery: React.Dispatch<React.SetStateAction<string>>;
    getInsightData: () => void
}

type ColumnInput = {
    columnName: string;
    aggregationType?: string;
    alias?: string;
}

type WhereInput = {
    columnName: string;
    condition: string;
    input: string
}

export const SQLQueryInput: React.FC<QueryInputProps> = ({
    rawQuery,
    setRawQuery,
    getInsightData
}) => {

    const { toast } = useToast()
    const [source, setSource] = useState<string>('')
    const [columns, setColumns] = useState<Array<ColumnInput>>([{ columnName: '' }])
    const [where, setWhere] = useState<WhereInput>({columnName: "", condition: "", input: ""} as WhereInput)
    const [sortBy, setSortBy] = useState<string>('')
    const [limit, setLimit] = useState<string>('')

    const addColumn = () => {
        setColumns([...columns, { columnName: '' }])
    }

    useEffect(() => {
        if(rawQuery && rawQuery.length > 0) {
            // write logic to extract source, columns, where, sortedBy, limit from rawQuery
        }
    },[])


    useEffect(() => {
        // Make the raw Query

        if (source !== "" && columns[0].columnName !== "") {
            var currentQuery = "SELECT ";
            columns.forEach((column, idx) => {
                if (column.aggregationType && column.aggregationType !== "" && column.aggregationType !== "none") {
                    currentQuery += column.aggregationType + "(" + column.columnName + ")";
                }
                else {
                    currentQuery += column.columnName
                }
                if (column.alias) {
                    currentQuery += " AS " + column.alias
                }
                if (idx != columns.length - 1) {
                    currentQuery += " ,"
                }
            })

            currentQuery += " FROM " + source

            if(where.columnName && where.columnName !== "" && where.condition !== "" && where.input != "") {
                currentQuery += " WHERE " + where.columnName + " " + where.condition + " " + where.input
            }

            if(sortBy != "") {
                currentQuery += " ORDER BY " + sortBy
            }

            if(limit != "") {
                currentQuery += " LIMIT " + limit
            }

            setRawQuery(currentQuery)

        }

    }, [source, columns, where, sortBy, limit, setRawQuery])


    const deleteColumn = (idx: number) => {
        if (columns.length == 1) {
            toast({ title: "At least 1 column is required" });
            return
        }
        setColumns((prevColumns) => {
            const updatedColumns = [...prevColumns];
            updatedColumns.splice(idx, 1);
            return updatedColumns;
        });
    }

    const changeAggregation = (value: string, idx: number) => {
        setColumns(prevColumns => {
            const updatedColumns = [...prevColumns];
            updatedColumns[idx] = { ...updatedColumns[idx], aggregationType: value };
            return updatedColumns;
        });
    }

    const changeColumnName = (value: string, idx: number) => {
        setColumns(prevColumns => {
            const updatedColumns = [...prevColumns];
            updatedColumns[idx] = { ...updatedColumns[idx], columnName: value };
            return updatedColumns;
        });
    }

    const changeAlias = (value: string, idx: number) => {
        setColumns(prevColumns => {
            const updatedColumns = [...prevColumns];
            updatedColumns[idx] = { ...updatedColumns[idx], alias: value };
            return updatedColumns;
        });
    }

    const changeWhereColumn = (column: string) => {
        setWhere( prevWhere => {
            const updatedWhere = {
                columnName: column,
                condition: prevWhere.condition,
                input: prevWhere.input
            }
            return updatedWhere;
        });
    }

    const changeWhereCondition = (condition: string) => {
        setWhere( prevWhere => {
            const updatedWhere = {
                columnName: prevWhere.columnName,
                condition: condition,
                input: prevWhere.input
            }
            return updatedWhere;
        });
    }

    const changeWhereInput = (input: string) => {
        setWhere( prevWhere => {
            const updatedWhere = {
                columnName: prevWhere.columnName,
                condition: prevWhere.condition,
                input: input
            }
            return updatedWhere;
        });
    }


    return (
        <div className="w-full h-full">
            {
                <Tabs defaultValue="Query" className="w-full h-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="Query">Query</TabsTrigger>
                        <TabsTrigger value="Raw_Query">Raw Query</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Query">
                        <Card className='p-1 flex flex-col gap-1'>
                            <Input
                                id="source"
                                placeholder="* Source"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            />
                            {
                                columns.map((column, idx) => {
                                    return (
                                        <div className="w-full flex flex-row gap-3" key={idx}>

                                            <Input
                                                placeholder='* Column Name'
                                                value={column.columnName}
                                                className="w-[200px]"
                                                onChange={(e) => changeColumnName(e.target.value, idx)} />

                                            <Select onValueChange={(value: string) => changeAggregation(value, idx)}>
                                                <SelectTrigger className="w-[200px]">
                                                    <SelectValue placeholder="Aggregation Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="none">None</SelectItem>
                                                        <SelectItem value="SUM">SUM</SelectItem>
                                                        <SelectItem value="AVG">AVG</SelectItem>
                                                        <SelectItem value="MIN">MIN</SelectItem>
                                                        <SelectItem value="MAX">MAX</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                            <Input
                                                placeholder='Alias'
                                                value={column.alias}
                                                className="w-[200px]"
                                                onChange={(e) => changeAlias(e.target.value, idx)} />

                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={addColumn}>
                                                <PlusCircleIcon className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                size="icon" onClick={() => deleteColumn(idx)}>
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>

                                        </div>
                                    )
                                })
                            }

                            <div className="w-full flex flex-row gap-3">
                                <Input
                                    placeholder='Where'
                                    value={where.columnName}
                                    onChange={(e) => changeWhereColumn(e.target.value)}
                                    className="w-[200px]" />

                                <Select onValueChange={(value: string) => changeWhereCondition(value)}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Relation Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        <SelectItem value=" ">{"None"}</SelectItem>
                                            <SelectItem value="==">{"equal == "}</SelectItem>
                                            <SelectItem value=">=">{"greater than equal to >="}</SelectItem>
                                            <SelectItem value="<=">{"less than equal to <="}</SelectItem>
                                            <SelectItem value=">">{"greater than >"}</SelectItem>
                                            <SelectItem value="<">{"less than <"}</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Input
                                    placeholder='Input'
                                    value={where.input}
                                    onChange={(e) => changeWhereInput(e.target.value)}
                                    className="w-[200px]" />

                            </div>

                            <Input
                                placeholder='Sort By'
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-[200px]" />

                            <Input
                                placeholder='Limit'
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="w-[200px]" />

                            <Textarea
                                placeholder="Raw Query"
                                readOnly={true}
                                className="mt-5"
                                value={format(rawQuery)}
                            />
                            <Button
                                onClick={getInsightData}>
                                Get Data
                            </Button>
                        </Card>
                    </TabsContent>
                    <TabsContent value="Raw_Query">
                        <Card className='p-1 flex flex-col gap-1'>
                            <Textarea
                                placeholder="Raw Query"
                                value={format(rawQuery)}
                                onChange={(e) => setRawQuery(e.target.value)}
                            />
                            <Button
                                onClick={getInsightData}>
                                Get Data
                            </Button>
                        </Card>
                    </TabsContent>
                </Tabs>
            }
        </div>
    )
}
