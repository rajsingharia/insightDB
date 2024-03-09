import { FetchDataResponse, userIntegrationResponse } from "@/app/(root)/addInsight/page";
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
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-min-noconflict/ext-language_tools";
import { useTheme } from "next-themes";

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
    createNewAlert: () => void,
    insightData: FetchDataResponse
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
    createNewAlert,
    insightData }) => {

    const AlertDestinations = ["SLACK", "EMAIL", "WEBHOOK"]
    const Conditions = ["equal", "notEqual", "greaterThan", "lessThan", "greaterThanEqual", "lessThanEqual"]

    const { theme } = useTheme()

    const OtherConfig = () => {
        if (destination === 'SLACK') {
            otherConfig = '{\n\t"message": "YOUR_MESSAGE",\n\t"slack_webhook": "YOUR_WEB_HOOK"\n}'
        }
        else if (destination === 'EMAIL') {
            otherConfig = '{\n\t"message": "YOUR_MESSAGE",\n\t"email": "YOUR_EMAIL"\n}'
        }
        else if (destination === 'WEBHOOK') {
            otherConfig = '{\n\t"message": "YOUR_MESSAGE",\n\t"webhook": "YOUR_WEB_HOOK"\n}'
        }
        return (
            <>
                <p className="text-sm text-muted-foreground">
                    {"Use {{row}} {{condition}} {{value}} in message for usage of row, condition and value"}
                </p>
                <AceEditor
                    aria-label="editor"
                    mode="json"
                    theme={theme === "dark" ? "terminal" : "github"}
                    name="editor"
                    width="100%"
                    fontSize={12}
                    minLines={13}
                    maxLines={18}
                    showPrintMargin={false}
                    showGutter
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true
                    }}
                    value={otherConfig}
                    onChange={(value) => setOtherConfig(value)}
                />
            </>
        )
    }

    return (
        <div className="w-full h-full">
            {
                <div className="flex flex-col w-full h-full gap-2 p-2">
                    <Select
                        value={destination}
                        onValueChange={(value: string) => { setDestination(value) }}>
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
                        <Select
                            value={row}
                            onValueChange={(value: string) => {
                                setRow(value)
                            }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Row" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        insightData.fields.map((fields, idx) => (
                                            <SelectItem
                                                key={idx}
                                                value={fields}>
                                                {fields}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
                </div >
            }
        </div >
    );
}
