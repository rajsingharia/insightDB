import { userIntegrationResponse } from "@/app/(root)/addInsight/page";
import CustomAxios from "@/utils/CustomAxios";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Card, CardContent } from "../ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface AlertCreationSectionOneProps {
    destination: string | undefined;
    setDestination: React.Dispatch<React.SetStateAction<string | undefined>>;
    row: string | undefined;
    setRow: React.Dispatch<React.SetStateAction<string | undefined>>;
    condition: string | undefined;
    setCondition: React.Dispatch<React.SetStateAction<string | undefined>>;
    value: string | undefined;
    setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
    otherConfig: string | undefined;
    setOtherConfig: React.Dispatch<React.SetStateAction<string | undefined>>;
    cronExp: string | undefined;
    setCronExp: React.Dispatch<React.SetStateAction<string | undefined>>;
    repeatCount: number | undefined;
    setRepeatCount: React.Dispatch<React.SetStateAction<number | undefined>>;
    createNewAlert: () => void
}


export const AlertCreationSectionTwo: React.FC<AlertCreationSectionOneProps> = ({
    destination,
    setDestination,
    row,
    setRow,
    condition,
    setCondition,
    value,
    setValue,
    otherConfig,
    setOtherConfig,
    cronExp,
    setCronExp,
    repeatCount,
    setRepeatCount,
    createNewAlert }) => {

    const AlertDestinations = ["SLACK", "EMAIL"]
    const Conditions = ["equal", "notEqual", "greaterThan", "lessThan", "greaterThanEqual", "lessThanEqual"]

    const OtherConfig = () => {
        if (destination === 'SLACK') {
            return (
                <Textarea
                    rows={3}
                    placeholder={'{ "message": "YOUR_MESSAGE", "webhook": "YOUR_WEB_HOOK"}'}
                    value={otherConfig}
                    onChange={e => setOtherConfig(e.target.value)} />
            )
        }
        else if (destination === 'EMAIL') {
            return (
                <Textarea
                    rows={3}
                    placeholder={'{ "message": "YOUR_MESSAGE", "email": "YOUR_EMAIL" }'}
                    value={otherConfig}
                    onChange={e => setOtherConfig(e.target.value)} />
            )
        }
    }

    return (
        <div className="w-full h-full">
            {
                <div className="flex flex-col w-full h-full gap-8 p-2">
                    <Select
                        value={destination}
                        onValueChange={(value: string) => {
                            setDestination(value)
                        }}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Destination" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    AlertDestinations.map((destination, idx) => (
                                        <SelectItem
                                            key={idx}
                                            value={destination}>
                                            {destination}
                                        </SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {
                        destination &&
                        OtherConfig()
                    }
                    <div className="flex flex-row items-center mt-2 gap-2">
                        <Input
                            value={row}
                            onChange={e => setRow(e.target.value)}
                            placeholder="Row" />
                        <Select
                            value={condition}
                            onValueChange={(value: string) => {
                                setCondition(value)
                            }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        Conditions.map((condition, idx) => (
                                            <SelectItem
                                                key={idx}
                                                value={condition}>
                                                {condition}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Input
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder="Value" />
                    </div>
                    <Input
                        value={cronExp}
                        onChange={e => setCronExp(e.target.value)}
                        placeholder="Enter Cron Expression" />
                    <Input
                        value={repeatCount}
                        type="number"
                        onChange={e => setRepeatCount(Number(e.target.value))}
                        placeholder="Enter Repeat Count" />

                    <Button
                        onClick={createNewAlert}>
                        Submit</Button>
                </div>
            }
        </div>
    );
}
