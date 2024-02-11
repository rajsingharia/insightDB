"use client"

import { ChartDataInput, FetchDataResponse } from '@/app/(root)/addInsight/page'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { getRandomNeonColor } from '@/utils/Helper'
import { SwatchesPicker } from 'react-color'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface TextAreaInputListProps {
    setChartUIData: React.Dispatch<React.SetStateAction<ChartDataInput | undefined>>,
    insightData: FetchDataResponse | undefined
}


export interface TextAreaData extends ChartDataInput {
    column: string;
    suffixString: string;
    prefixString: string;
    color: string;
}

export const TextAreaInput: React.FC<TextAreaInputListProps> = ({
    setChartUIData,
    insightData }) => {

    const [column, setColumn] = useState<string>();
    const [suffixString, setSuffixString] = useState<string>("");
    const [prefixString, setPrefixString] = useState<string>("");
    const [color, setColor] = useState<string>();

    useEffect(() => {
        const randomColor = getRandomNeonColor(1)
        setColor(randomColor[0])
    }, [])

    const createChart = () => {
        const temp: TextAreaData = {
            type: 'text',
            column: column!,
            suffixString: suffixString!,
            prefixString: prefixString!,
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
                Column
            </h4>
            <Select onValueChange={(value) => setColumn(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="column" />
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
            <Input
                className='mt-2'
                placeholder="Suffix"
                value={suffixString}
                onChange={(event) => setSuffixString(event.target.value)} />
            <Input
                className='mt-2 mb-2'
                placeholder="prefix"
                value={prefixString}
                onChange={(event) => setPrefixString(event.target.value)} />
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <div style={{ background: `${color}` }} className={"h-5 w-5"} />
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

export default TextAreaInput