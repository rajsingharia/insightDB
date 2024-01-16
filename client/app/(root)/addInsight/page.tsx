
"use client"

import { useEffect, useState } from "react";
import AuthAxios from "@/utils/AuthAxios";
import { SupportedCharList } from "@/components/supportedChartsList/SupportedCharList";
import { InsightChart } from "@/components/charts/InsightChart";
import { QueryFields } from "@/components/query/QueryFields";
import { ICharts } from "@/interfaces/ICharts";
import { ChartSettings } from "@/components/chartSettings/ChartSettings";
import { ChartColors } from "@/types/ChartColors";
import { GraphData } from "@/types/GraphData";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button";
import { DrawingPinFilledIcon } from "@radix-ui/react-icons";

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


  const changeRefreshRate = (refreshRate: number) => {
    setRefreshRate(refreshRate);
  }


  useEffect(() => {
    const authAxios = AuthAxios.getAuthAxios();
    authAxios.get('/integrations')
      .then((res) => {
        console.log(`User Integrations: `, res.data)
        setUserIntegrations(res.data)
      })
      .catch((err) => {
        console.log(err);
        toast({ title: "Error Fetching Integrations" })
      });

    // authAxios.get('/charts/supported-charts')
    //   .then((res) => {
    //     console.log(`Supported Charts: `, res.data)
    //     setSupportedChartsList(res.data.supportedCharts);
    //     setSelectedChart(res.data.defaultChart);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     toast({ title: "Error Fetching Supported Charts" });
    //   });

  }, [toast]);

  const handelSelectedIntegrationChange = (selectedIntegration: userIntegrationResponse | null) => {
    if (selectedIntegration) setSelectedIntegration(selectedIntegration);
  };

  const saveInsight = () => {

    const authAxios = AuthAxios.getAuthAxios();

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
    // else if (!selectedChartColors) {
    //   toast({ title: "No Chart Colors" });
    //   return;
    // }

    //insightGraphData -> should contain chartType and chartData(color, labels)

    // const graphData: GraphData = {
    //   chartType: selectedChart.value,
    //   chartColors: selectedChartColors
    // }

    // const insightGraphData = JSON.stringify(graphData);

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

    authAxios.post('/insights', body)
      .then((res) => {
        console.log(`Insight Saved: `, res.data)
        toast({ title: "Insight Saved Successfully ✅🔒" });
        // navigate('/',{ replace: true });
        router.push('/')
      })
      .catch((err) => {
        console.log(err)
      });
  }


  return (
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
                chartType={selectedChart}
                chartUIData={chartUIData}
              />
            }
            {
              insightData && insightData.countOfFields > 0 && selectedChart &&
              <div className="z-10 h-full w-full flex justify-end absolute">
                <Button
                  onClick={saveInsight}>
                  <DrawingPinFilledIcon
                    className="mr-2 h-4 w-4" /> Save
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
                //setSelectedChartColors={setSelectedChartColors}
                chartType={selectedChart}
                rawQuery={rawQuery}
                setRawQuery={setRawQuery}
                changeRefreshRate={changeRefreshRate}
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
            <ChartSettings
              handelSelectedIntegrationChange={handelSelectedIntegrationChange}
              userIntegrations={userIntegrations}
              insightTitle={insightTitle}
              setInsightTitle={setInsightTitle}
              insightDescription={insightDescription}
              setInsightDescription={setInsightDescription}
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
  )
}
