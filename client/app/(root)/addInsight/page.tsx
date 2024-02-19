
"use client"

import { useEffect, useState } from "react";
import AuthAxios from "@/utils/AuthAxios";
import { SupportedCharList } from "@/components/supportedChartsList/SupportedCharList";
import { InsightChart } from "@/components/charts/InsightChart";
import { QueryFields } from "@/components/query/QueryFields";
import { ICharts } from "@/interfaces/ICharts";
import { ChartSettings } from "@/components/chartSettings/ChartSettings";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"
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
import { CircularProgress } from "@/components/common/CircularProgress";

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


export default function AddInsightPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [userIntegrations, setUserIntegrations] = useState<userIntegrationResponse[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<userIntegrationResponse | undefined>(undefined);
  const [selectedChart, setSelectedChart] = useState<ICharts>({} as ICharts);
  // const [selectedChartColors, setSelectedChartColors] = useState<ChartColors | undefined>(undefined);
  const [refreshRate, setRefreshRate] = useState<number>(0);
  const [insightTitle, setInsightTitle] = useState<string>('');
  const [insightDescription, setInsightDescription] = useState<string>('');
  const [rawQuery, setRawQuery] = useState<string>('');
  const [insightData, setInsightData] = useState<FetchDataResponse | undefined>(undefined);
  const [chartUIData, setChartUIData] = useState<ChartDataInput>()
  const [loading, setLoading] = useState<boolean>(true)
  const [dashboards, setDashboards] = useState<{ id: string, title: string }[]>([])
  const [selectedDashboard, setSelectedDashboard] = useState<{ id: string, title: string }>()

  const changeRefreshRate = (refreshRate: number) => {
    setRefreshRate(refreshRate);
  }

  useEffect(() => {
    const authAxios = AuthAxios.getOrgAxios();
    authAxios.get('/integrations')
      .then((res) => {
        console.log(`User Integrations: `, res.data)
        setUserIntegrations(res.data)
      })
      .catch((err) => {
        console.log(err);
        toast({ title: "Error Fetching Integrations" })
      })
      .finally(() => {
        setLoading(false)
      })

    const fetchDataAxios = AuthAxios.getFetchDataAxios()

    fetchDataAxios.get('/dashboard/all')
      .then((res) => {
        setDashboards(res.data)
      })
      .catch((err) => {
        toast({ title: "Error fetching user Insight: " + err.message })
      })

  }, [toast]);

  const handelSelectedIntegrationChange = (selectedIntegration: userIntegrationResponse | null) => {
    if (selectedIntegration) setSelectedIntegration(selectedIntegration);
  };

  const handelDashboardChange = (id: string) => {
    setSelectedDashboard(dashboards.find(d => d.id === id));
  }

  const saveInsight = () => {

    const authAxios = AuthAxios.getOrgAxios();

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
      dashboardId: "8970c7d9-a0bc-4577-a3ff-53dc55096b0d",
      insight: saveInsightRequest
    }

    authAxios.post('/insights', body)
      .then((res) => {
        console.log(`Insight Saved: `, res.data)
        toast({ title: "Insight Saved Successfully ✅🔒" });
        router.push('/')
      })
      .catch((err) => {
        console.log(err)
      });
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
              <ResizablePanel defaultSize={40} className="flex justify-center items-center w-full p-1 rounded-lg relative">
                {
                  // TODO: Explore lazy loading of chart component
                  insightData && insightData.countOfFields > 0 && chartUIData &&
                  <InsightChart
                    insightData={insightData}
                    chartDetail={selectedChart}
                    chartUIData={chartUIData}
                  />
                }
                {
                  insightData && insightData.countOfFields > 0 && selectedChart &&
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
                      onClick={saveInsight}>
                      <RefreshCcw
                        className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={saveInsight}>
                      <PinIcon
                        className="h-4 w-4 mr-2" /> Save
                    </Button>
                  </div>
                }
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={60} className="w-full p-1 rounded-lg">
                {
                  selectedIntegration &&
                  <QueryFields
                    integrationId={selectedIntegration.id}
                    integrationType={selectedIntegration.type}
                    setInsightData={setInsightData}
                    chartType={selectedChart}
                    rawQuery={rawQuery}
                    setRawQuery={setRawQuery}
                  />
                }
              </ResizablePanel>
            </ResizablePanelGroup>

          </ResizablePanel >
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} className="flex flex-col justify-start items-center h-full rounded-lg">
            <div className="flex flex-col justify-start items-center h-full w-full p-1">
              Settings
              {
                dashboards && dashboards.length > 0 &&
                <ChartSettings
                  selectedIntegration={selectedIntegration}
                  handelSelectedIntegrationChange={handelSelectedIntegrationChange}
                  userIntegrations={userIntegrations}
                  insightTitle={insightTitle}
                  setInsightTitle={setInsightTitle}
                  insightDescription={insightDescription}
                  setInsightDescription={setInsightDescription}
                  dashboards={dashboards}
                  handelDashboardChange={handelDashboardChange}
                />
              }
              <div className="w-full mt-4 pr-4 overflow-y-scroll rounded">
                {
                  insightData && insightData.countOfFields > 0 &&
                  <SupportedCharList
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    setChartUIData={setChartUIData}
                    insightData={insightData}
                  />
                }
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup >
      }
    </>
  )
}
