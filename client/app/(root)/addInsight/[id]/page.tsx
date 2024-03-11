
"use client"

import { useEffect, useState } from "react";
import CustomAxios from "@/utils/CustomAxios";
import { SupportedCharList } from "@/components/supportedChartsList/SupportedCharList";
import { InsightChart } from "@/components/charts/InsightChart";
import { QueryFields } from "@/components/query/QueryFields";
import { ICharts } from "@/interfaces/ICharts";
import { ChartSettings } from "@/components/chartSettings/ChartSettings";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"
import { useParams } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button";
import { PinIcon, RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import IUserInsights from "@/interfaces/IUserInsights";
import { SupportedCharts } from "@/utils/Constants";
import { CircularProgress } from "@/components/common/CircularProgress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";

export type userIntegrationResponse = {
  id: string;
  name: string;
  type: string;
  credentials: JSON;
  user: string;
  createdAt: string;
  updatedAt: string;
}

type saveInsightRequest = {
  title: string;
  description: string;
  integrationId: string;
  graphData: JSON;
  rawQuery: string;
  refreshRate?: number;
}

export type FetchDataResponse = {
  countOfFields: number;
  fields: string[];
  timeField?: string;
  data: unknown[];
}

export interface ChartDataInput {
  type: string,
}


export default function AddInsightPageQuery() {
  const router = useRouter()
  const { toast } = useToast()
  const param = useParams()
  var insightId: string = ""
  if (typeof (param.id) === 'string') {
    insightId = param.id
  } else {
    insightId = param.id[0]
  }

  const [userIntegrations, setUserIntegrations] = useState<userIntegrationResponse[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<userIntegrationResponse | undefined>(undefined);
  const [selectedChart, setSelectedChart] = useState<ICharts>({} as ICharts);
  // const [selectedChartColors, setSelectedChartColors] = useState<ChartColors | undefined>(undefined);
  const [refreshRate, setRefreshRate] = useState<number>();
  const [insightTitle, setInsightTitle] = useState<string>('');
  const [insightDescription, setInsightDescription] = useState<string>('');
  const [rawQuery, setRawQuery] = useState<string>();
  const [insightChartData, setInsightChartData] = useState<FetchDataResponse | undefined>(undefined);
  const [chartUIData, setChartUIData] = useState<ChartDataInput>()
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedDashboard, setSelectedDashboard] = useState<{ id: string, title: string }>()
  const [dashboards, setDashboards] = useState<{ id: string, title: string }[]>([])

  const changeRefreshRate = (refreshRate: number) => {
    setRefreshRate(refreshRate);
  }



  useEffect(() => {
    const customOrgAxios = CustomAxios.getOrgAxios();
    const customDataAxios = CustomAxios.getFetchDataAxios()

    const fetchData = async () => {
      setLoading(true)
      try {
        console.log("insightId : ", insightId)
        const insightsResponse = await customDataAxios.get(`/insights/${insightId}`)
        if (!insightsResponse || !insightsResponse.data) throw new Error("Failed to get Insight")

        const insight = insightsResponse.data
        console.log("insight : ", insight)

        setRawQuery(insight.rawQuery)
        setRefreshRate(insight.refreshRate)
        setChartUIData(insight.graphData)

        const chart = SupportedCharts.find((chart) => chart.value === insight.graphData.type)
        if (chart != null) {
          setSelectedChart(chart)
        }
        setInsightTitle(insight.title)
        setInsightDescription(insight.description)

        const userIntegrationsResponse = await customDataAxios.get('/integrations')
        console.log("Integrations response : ", userIntegrationsResponse.data)
        setUserIntegrations(userIntegrationsResponse.data)

        const selectedIntegration = userIntegrationsResponse.data.find((integration: any) => integration.id == insight.integrationId)
        console.log("selectedIntegration : ", selectedIntegration)
        setSelectedIntegration(selectedIntegration)

        const body = {
          integrationId: insight.integrationId,
          rawQuery: insight.rawQuery
        }

        const chartInsightDataResponse = await customDataAxios.post('/fetchData/query', body)
        const fetchedData = chartInsightDataResponse.data;
        console.log("fetchedData : ", fetchedData as FetchDataResponse)
        setInsightChartData(fetchedData as FetchDataResponse);

        const dashboardsResponse = await customOrgAxios.get('/dashboard/all')
        console.log("dashboardsResponse : ", dashboardsResponse)
        setDashboards(dashboardsResponse.data)

      } catch (error) {
        toast({ title: "Error : " + error })
      } finally {
        setLoading(false)
      }
    }

    fetchData()

  }, [toast, insightId])

  const handelSelectedIntegrationChange = (id: string) => {
    const selectedIntegration = userIntegrations.find(i => i.id === id)
    if (!selectedIntegration) return;
    setSelectedIntegration(selectedIntegration);
  };


  const editInsight = () => {

    const fetchDataAxios = CustomAxios.getFetchDataAxios();

    if (!selectedIntegration) {
      toast({ title: "No Integration Selected" });
      return;
    }
    else if (!insightTitle) {
      toast({ title: "No Title" });
      return;
    }
    else if (!rawQuery) {
      toast({ title: "No Query" });
      return;
    }

    const saveInsightRequest: saveInsightRequest = {
      title: insightTitle,
      description: insightDescription,
      integrationId: selectedIntegration?.id || '',
      graphData: JSON.parse(JSON.stringify(chartUIData!)),
      rawQuery: rawQuery,
      refreshRate: refreshRate
    }

    const body = {
      insight: saveInsightRequest
    }

    fetchDataAxios.patch(`/insights/${insightId}`, body)
      .then((res) => {
        console.log(`Insight Saved: `, res.data)
        toast({ title: "Insight Updated Successfully ✅" });
        router.push('/')
      })
      .catch((err) => {
        console.log(err)
      });
  }

  const handelDashboardChange = (id: string) => {
    setSelectedDashboard(dashboards.find(d => d.id === id));
  }


  return (
    <>
      {
        loading &&
        <div className="flex flex-col justify-center items-center w-full h-full ">
          <CircularProgress />
        </div>
      }
      {
        !loading &&
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full gap-2">
          <ResizablePanel defaultSize={75} className="h-full">
            <ResizablePanelGroup
              direction="vertical"
              className="gap-2">
              <ResizablePanel defaultSize={40} className="flex justify-center items-center w-full p-1 rounded-lg relative flex-col">
                {
                  // TODO: Explore lazy loading of chart component
                  insightChartData && insightChartData.countOfFields > 0 && chartUIData &&
                  <InsightChart
                    insightData={insightChartData}
                    chartDetail={selectedChart}
                    chartUIData={chartUIData}
                  />
                }
                {
                  insightChartData && insightChartData.countOfFields > 0 && selectedChart &&
                  <div className="z-10 h-full w-full flex justify-end absolute gap-1 mt-[1px]">
                    <Select onValueChange={(value) => changeRefreshRate(Number(value))}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Refresh" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="1">1 seconds</SelectItem>
                          <SelectItem value="10">10 seconds</SelectItem>
                          <SelectItem value="60">1 minutes</SelectItem>
                          <SelectItem value="600">10 minutes</SelectItem>
                          <SelectItem value="3600">1 hours</SelectItem>
                          <SelectItem value="36000">10 hours</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      onClick={editInsight}>
                      <RefreshCcw
                        className="h-4 w-4" />
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <PinIcon
                            className="h-4 w-4 mr-2" /> Save
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add Insight</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-4">
                          <Input
                            className="w-full"
                            placeholder="Chart Title"
                            value={insightTitle}
                            onChange={(event) => setInsightTitle(event.target.value)}
                          />
                          <Input
                            className="w-full"
                            placeholder="Chart Description"
                            value={insightDescription}
                            onChange={(event) => setInsightDescription(event.target.value)}
                          />
                          <Select
                            value={selectedDashboard?.id}
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
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={editInsight}
                            type="submit">
                            Add Insight
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                }
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={60} className="w-full p-1 rounded-lg">
                {
                  selectedIntegration &&
                  <QueryFields
                    integrationId={selectedIntegration.id}
                    integrationType={selectedIntegration?.type}
                    setInsightData={setInsightChartData}
                    rawQuery={rawQuery}
                    setRawQuery={setRawQuery}
                  />
                }
              </ResizablePanel>
            </ResizablePanelGroup>

          </ResizablePanel >
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} >
            <ChartSettings
              selectedIntegration={selectedIntegration}
              handelSelectedIntegrationChange={handelSelectedIntegrationChange}
              userIntegrations={userIntegrations}
              selectedChart={selectedChart}
              setSelectedChart={setSelectedChart}
              chartUIData={chartUIData}
              setChartUIData={setChartUIData}
              insightData={insightChartData}
              setInsightData={setInsightChartData}
            />
          </ResizablePanel>
        </ResizablePanelGroup >
      }
    </>
  )
}
