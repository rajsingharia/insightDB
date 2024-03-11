"use client"

import { ChartDataInput, FetchDataResponse, userIntegrationResponse } from '@/app/(root)/addInsight/page'
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
import { Separator } from '@radix-ui/react-select'
import { useEffect, useState } from 'react'
import CustomAxios from '@/utils/CustomAxios'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ICharts } from '@/interfaces/ICharts'
import { SupportedCharList } from '../supportedChartsList/SupportedCharList'
import { CircularProgress } from '../common/CircularProgress'
import { ScrollArea } from '../ui/scroll-area'

interface ChartSettingsProps {
    selectedIntegration: userIntegrationResponse | undefined,
    handelSelectedIntegrationChange: (id: string) => void,
    userIntegrations: userIntegrationResponse[],
    selectedChart: ICharts,
    setSelectedChart: (chart: ICharts) => void,
    chartUIData: ChartDataInput | undefined,
    setChartUIData: React.Dispatch<React.SetStateAction<ChartDataInput | undefined>>,
    insightData: FetchDataResponse | undefined,
    setInsightData: React.Dispatch<React.SetStateAction<FetchDataResponse | undefined>>,
}


export const ChartSettings: React.FC<ChartSettingsProps> = (
    {
        selectedIntegration,
        handelSelectedIntegrationChange,
        userIntegrations,
        selectedChart,
        setSelectedChart,
        chartUIData,
        setChartUIData,
        insightData,
        setInsightData }) => {

    const { toast } = useToast();

    const [loading, setLoading] = useState<boolean>()
    const [dataInfo, setDataInfo] = useState<string[]>()

    useEffect(() => {
        if (selectedIntegration != null) {
            (
                async () => {
                    setLoading(true)
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
                    } finally {
                        setLoading(false)
                    }
                }
            )()
        }
    }, [toast, selectedIntegration])

    return (
        <Tabs defaultValue="chart_setting" className="h-full p-1">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chart_setting">Setting</TabsTrigger>
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
            </TabsList>
            <TabsContent value="chart_setting" className='h-full'>
                <div className='flex flex-col h-full'>
                    <Select
                        value={selectedIntegration?.id}
                        onValueChange={(value: string) => {
                            setChartUIData(undefined)
                            setInsightData(undefined)
                            setSelectedChart({} as ICharts)
                            handelSelectedIntegrationChange(value)
                        }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Integration" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectGroup>
                                {
                                    userIntegrations.map((integration) => {
                                        return (
                                            <SelectItem
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
                    {
                        loading &&
                        <div className="flex flex-col justify-center items-center w-full h-full">
                            <CircularProgress />
                        </div>
                    }
                    {
                        !loading &&
                        <ScrollArea className='flex h-auto p-2 grow'>
                            {
                                !loading &&
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
                        </ScrollArea>
                    }
                </div>
            </TabsContent>
            <TabsContent value="visualization">
                {
                    insightData && insightData.countOfFields > 0 &&
                    <SupportedCharList
                        selectedChart={selectedChart}
                        setSelectedChart={setSelectedChart}
                        chartUIData={chartUIData}
                        setChartUIData={setChartUIData}
                        insightData={insightData}
                    />
                }
            </TabsContent>
        </Tabs>
    )
}
