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
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Separator } from '@radix-ui/react-select'
import { useEffect, useState } from 'react'
import CustomAxios from '@/utils/CustomAxios'

interface ChartSettingsProps {
    selectedIntegration: userIntegrationResponse | undefined,
    handelSelectedIntegrationChange: (id: string) => void,
    userIntegrations: userIntegrationResponse[],
    insightTitle: string,
    setInsightTitle: React.Dispatch<React.SetStateAction<string>>,
    insightDescription: string,
    setInsightDescription: React.Dispatch<React.SetStateAction<string>>,
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
    }) => {

    const { toast } = useToast();

    const [dataInfo, setDataInfo] = useState<string[]>()

    useEffect(() => {
        if (selectedIntegration != null) {
            (
                async () => {
                    const fetchDataAxios = CustomAxios.getFetchDataAxios();
                    try {
                        const body = {
                            integrationId: selectedIntegration.id
                        }
                        const dataInfoResponse = await fetchDataAxios.post('/fetchData/info', body)
                        console.log("data info : ", dataInfoResponse.data)
                        setDataInfo(dataInfoResponse.data)
                    } catch (error) {
                        toast({ title: "Error : " + error })
                    }
                }
            )()
        }
    }, [toast, selectedIntegration])

    return (
        <div className="flex flex-col justify-start items-start w-full mt-2 gap-3">

            {/* <Select
                onValueChange={(value: string) => {
                    handelDashboardChange(value)
                }}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Dashboard" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {
                            dashboards.map((dashboard) => {
                                return (
                                    <SelectItem
                                        value={dashboard.id}
                                        key={dashboard.id}>
                                        {dashboard.title}
                                    </SelectItem>
                                )
                            })
                        }
                    </SelectGroup>
                </SelectContent>
            </Select> */}

            <Select
                onValueChange={(value: string) => {
                    handelSelectedIntegrationChange(value)
                }}>
                <SelectTrigger className="w-full h-[35px]">
                    <SelectValue placeholder="Select Integration" />
                </SelectTrigger>
                <SelectContent >
                    <SelectGroup>
                        {
                            userIntegrations.map((integration) => {
                                return (
                                    <SelectItem
                                        className="h-[35px]"
                                        key={integration.id}
                                        value={integration.id}>
                                        {integration.name}
                                    </SelectItem>
                                )
                            })
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Input
                className="h-[35px]"
                placeholder="Chart Title"
                value={insightTitle}
                onChange={(event) => setInsightTitle(event.target.value)}
            />
            <Input
                className="h-[35px]"
                placeholder="Chart Description"
                value={insightDescription}
                onChange={(event) => setInsightDescription(event.target.value)}
            />
            <ScrollArea className="w-full h-72 rounded-md border">
                <div className="p-4">
                    {
                        dataInfo?.map((tag, i) => (
                            <>
                                <div
                                    key={i}
                                    className="text-sm">
                                    {tag}
                                </div>
                                <Separator className="my-2" />
                            </>
                        ))
                    }
                </div>
            </ScrollArea>
        </div>
    )
}
