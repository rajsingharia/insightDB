"use client"

import { userIntegrationResponse } from '@/app/(root)/addInsight/page'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from '@/components/ui/use-toast'

interface ChartSettingsProps {
    selectedIntegration: userIntegrationResponse | undefined,
    handelSelectedIntegrationChange: (id: string) => void,
    userIntegrations: userIntegrationResponse[],
    insightTitle: string,
    setInsightTitle: React.Dispatch<React.SetStateAction<string>>,
    insightDescription: string,
    setInsightDescription: React.Dispatch<React.SetStateAction<string>>,
    dashboards: { id: string, title: string }[],
    handelDashboardChange: (id: string) => void
}


export const ChartSettings: React.FC<ChartSettingsProps> = (
    {
        selectedIntegration,
        handelSelectedIntegrationChange,
        userIntegrations,
        insightTitle,
        setInsightTitle,
        insightDescription,
        setInsightDescription,
        dashboards,
        handelDashboardChange
    }) => {


    // if (chartType === 'timeBar' || chartType === 'line' || chartType === 'area') {
    //     fields?.slice(1);
    // }

    // const handelColorChange = (index: number) => {

    //     const newBorderColor: string = getRandomNeonColor(1)[0];
    //     const newBackgroundColor: string = newBorderColor + '40';

    //     const newSelectedChartColors = selectedChartColors;
    //     if (newSelectedChartColors) {

    //         newSelectedChartColors.borderColor[index] = newBorderColor;
    //         newSelectedChartColors.backgroundColor[index] = newBackgroundColor;
    //     }

    //     setSelectedChartColors(newSelectedChartColors);
    // }

    const { toast } = useToast();


    return (
        <div className="flex flex-col justify-start items-start w-full mt-2 gap-3">
            <Select
                onValueChange={(value: string) => {
                    handelSelectedIntegrationChange(value)
                }}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Integration" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Integrations</SelectLabel>
                        {
                            userIntegrations &&
                            userIntegrations.map((integration: any) => {
                                return (
                                    <SelectItem
                                        id={integration.id}
                                        value={integration.id}
                                        key={integration.id}>
                                        {integration?.name}
                                    </SelectItem>
                                )
                            })
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select
                onValueChange={(value: string) => { handelDashboardChange(value) }}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Integration" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Integrations</SelectLabel>
                        {
                            dashboards &&
                            dashboards.map((dashboard: { id: string, title: string }) => {
                                return (
                                    <SelectItem
                                        id={dashboard.id}
                                        value={dashboard.id}
                                        key={dashboard.id}>
                                        {dashboard.title}
                                    </SelectItem>
                                )
                            })
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Input
                placeholder="Chart Title"
                value={insightTitle}
                onChange={(event) => setInsightTitle(event.target.value)}
            />
            <Input
                placeholder="Chart Description"
                value={insightDescription}
                onChange={(event) => setInsightDescription(event.target.value)}
            />
            {/* {
                fields && selectedChartColors &&
                <div className="flex flex-col justify-start items-center w-full gap-3">
                    {
                        fields.map((field, index) => {
                            return (
                                <div
                                    key={field}
                                    className="flex flex-row justify-start items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        onClick={() => handelColorChange(index)}
                                        style={{
                                            backgroundColor: selectedChartColors?.backgroundColor.pop(),
                                            border: `2px solid ${selectedChartColors?.borderColor.pop()}`
                                        }} />
                                    <p>{field}</p>
                                </div>
                            )
                        })
                    }
                </div>
            } */}
        </div>
    )
}
