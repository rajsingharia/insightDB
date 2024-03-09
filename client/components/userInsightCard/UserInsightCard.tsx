import React, { useEffect, useState } from 'react'
import IUserInsights from "@/interfaces/IUserInsights"

import fetchDataAxios from '@/utils/CustomAxios';
import { CircularProgress } from "@/components/common/CircularProgress";
//Different for prod and dev environment
//import { BASE_URL } from '../../utils/Constants';
import AuthEventSource from "@/utils/AuthEventSource"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from 'lucide-react';
import { SupportedCharts } from '@/utils/Constants';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useRouter } from 'next/navigation';

import { useToast } from "@/components/ui/use-toast"
import { InsightChart } from "@/components/charts/InsightChart"
import CustomAxios from '@/utils/CustomAxios';
import { Separator } from '@radix-ui/react-select';
type UserInsightCardProps = {
    insight: IUserInsights;
}

type FetchDataResponse = {
    countOfFields: number;
    fields: string[];
    timeField?: string;
    data: unknown[];
}

export const UserInsightCard: React.FC<UserInsightCardProps> = ({ insight }) => {


    //TODO: Add a refresh button to refresh the data
    //TODO: Convert it into Atom (to share the states between the cards)

    const [chartData, setChartData] = useState<FetchDataResponse | undefined>(undefined);
    const chartType = insight.graphData.type;
    const chartDetails = SupportedCharts.find((chart) => chart.value === chartType)
    const [error, setError] = useState<string>('');
    const router = useRouter()
    const fetchDataAxios = CustomAxios.getFetchDataAxios();
    const orgAxios = CustomAxios.getOrgAxios();
    const { toast } = useToast()


    useEffect(() => {

        async function getData() {

            const body = {
                insightId: insight.id
            }

            fetchDataAxios.post('/fetchData', body)
                .then((res) => {
                    console.log("Data: ", res.data.data);
                    setChartData(res.data);
                })
                .catch((err) => {
                    console.log(err);
                    setError(err.message);
                });

            const refreshRate = insight.refreshRate;

            if (refreshRate > 0) {
                // makeSSEConnection();
                //startPolling(refreshRate * 1000)
            }

        }

        getData()

    }, [insight]);


    const startPolling = (refreshRate: number) => {
        setInterval(() => {

            const body = {
                insightId: insight.id
            }

            fetchDataAxios.post('/fetchData', body)
                .then((res) => {
                    console.log("Data: ", res.data.data);
                    setChartData(res.data);
                })
                .catch((err) => {
                    console.log(err);
                    setError(err.message);
                });

        }, refreshRate)
    }

    const duplicateInsight = () => {
        const insightId = insight.id
        fetchDataAxios.post(`/insights/duplicate/${insightId}`)
            .then((res) => {
                // router.refresh()
                location.reload();
            })
            .catch((err) => {
                toast({ title: "Error while duplicating insight :" + err.message })
            });
    }

    const deleteInsight = () => {
        const insightId = insight.id
        fetchDataAxios.delete(`/insights/${insightId}`)
            .then((res) => {
                // router.refresh()
                location.reload();
            })
            .catch((err) => {
                toast({ title: "Error while deleting insight :" + err.message })
            });
    }

    return (
        <div className="flex flex-col justify-center items-center border-solid hover:border-dotted border-purple-600 border-2 h-full w-full rounded-lg px-4 py-2 bg-purple-500 bg-opacity-0 hover:bg-opacity-10">
            {
                chartData && chartDetails ?
                    <div className="flex flex-col items-center h-full w-full p-3 ">
                        <h4 className="text-sm font-bold font-mono w-full">{insight.title}</h4>
                        <InsightChart
                            insightData={chartData}
                            chartDetail={chartDetails}
                            chartUIData={insight.graphData}
                        />
                        <Drawer>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className='absolute top-0 right-0 z-50 p-1 mt-1 cursor-pointer'>
                                        <MoreVerticalIcon className='h-[1rem] w-[1rem]' />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuGroup>
                                        <DrawerTrigger asChild>
                                            <DropdownMenuItem>
                                                View
                                                <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DrawerTrigger>
                                        <DropdownMenuItem onClick={() => router.push(`/addInsight/${insight.id}`)}>
                                            Edit
                                            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        {/* <DropdownMenuItem>
                                            Share
                                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                        </DropdownMenuItem> */}
                                        <DropdownMenuItem onClick={duplicateInsight}>
                                            Duplicate
                                            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={deleteInsight} className='bg-red-400'>
                                        Delete
                                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DrawerContent>
                                <div className="flex flex-col w-full items-center justify-center mt-3 h-[350px]">
                                    <InsightChart
                                        insightData={chartData}
                                        chartDetail={chartDetails}
                                        chartUIData={insight.graphData}
                                    />
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </div>
                    :
                    <div className="flex flex-col justify-between items-center w-full">
                        <h4 className="text-l font-bold font-mono text-black">{insight.title}</h4>
                        {
                            error ?
                                <p className="font-mono text-red-500">{error}</p>
                                :
                                <CircularProgress />
                        }
                    </div>
            }
        </div>
    )
}
