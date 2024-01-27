"use client"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import AuthAxios from "../../utils/AuthAxios";
import IUserInsights from "../../interfaces/IUserInsights";
import { UserInsightCard } from "../../components/userInsightCard/UserInsightCard";
import { CircularProgress } from '@/components/common/CircularProgress';
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

import "../../node_modules/react-grid-layout/css/styles.css"
import "../../node_modules/react-resizable/css/styles.css"
import { Button } from "@/components/ui/button";
import { LockClosedIcon, LockOpen2Icon } from "@radix-ui/react-icons";
import { Lock, Unlock } from "lucide-react";


export default function Home() {

  const { user } = useContext(AuthContext);
  const [userInsights, setUserInsights] = useState<IUserInsights[] | undefined>(undefined);
  const [enableEdit, setEnableEdit] = useState<boolean>(false)
  const [changeLayout, setChangeLayout] = useState<GridLayout.Layout[] | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast()
  const authAxios = AuthAxios.getAuthAxios();

  useEffect(() => {
    authAxios.get('/insights')
      .then((res) => {
        console.log("Insights: ", res.data);
        const insights = res.data;
        //for testing adding same insight 2 times
        // insights.push(insights[0]);
        // insights.push(insights[1]);
        setUserInsights(insights);

      })
      .catch((err) => {
        console.log(err)
        toast({ title: "Error fetching user Insight: " + err.message })
      })
      .finally(() => {
        //setTimeout(() => {
        setLoading(false);
        //}, 1000);
      });
  }, [])

  const onLayoutChange = (newLayout: GridLayout.Layout[]) => {
    if (!enableEdit) return
    setChangeLayout(newLayout)
  }

  const saveLayoutToDatabase = (insightId: string, x: number, y: number, h: number, w: number) => {

    const body = {
      layout: {
        x: x,
        y: y,
        h: h,
        w: w
      }
    }

    authAxios.patch(`/insights/onLayoutChange/${insightId}`, body)
      .then((res) => {

      })
      .catch((err) => {
        console.log(err)
        toast({ title: "Error Updating Insight Layout : " + err.message })
      })
  };

  const changeEnableState = (state: boolean) => {
    if (!state) {
      changeLayout?.forEach((layout) => {
        saveLayoutToDatabase(layout.i, layout.x, layout.y, layout.h, layout.w);
      });
      toast({ title: "Successfully Layout Changed ✨" })
    }
    setEnableEdit(state)
  }

  return (
    <div className="w-full h-full">
      {
        loading &&
        <div className="flex flex-col justify-center items-center w-full h-full ">
          <div className="text-lg font-semibold">🔍 Gathering Insights</div>
          <CircularProgress />
        </div>
      }
      {
        !loading && userInsights && userInsights.length === 0 &&
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="text-lg font-semibold">No Insights for you {user.firstName} 😕</div>
        </div>
      }
      {
        !loading && userInsights && userInsights.length > 0 &&
        <div className="absolute top-0 right-0 z-50 p-4">
          <Button variant={enableEdit ? 'secondary' : 'destructive'} size="icon">
            {
              enableEdit ? (
                <Unlock
                  onClick={() => changeEnableState(false)}
                  className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all"
                />
              ) : (
                <Lock
                  onClick={() => changeEnableState(true)}
                  className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all"
                />
              )
            }
          </Button>
        </div>
      }
      {
        !loading && userInsights && userInsights.length > 0 &&
        <ResponsiveGridLayout
          className="layout"
          // cols={11}
          rowHeight={30}
          // width={1130}
          isDraggable={enableEdit}
          isResizable={enableEdit}
          onLayoutChange={onLayoutChange}>
          {
            userInsights.map((insight) => {
              return (
                <Card
                  key={insight.id}
                  data-grid={{
                    x: insight.xCoords,
                    y: insight.yCoords,
                    w: insight.width,
                    h: insight.height
                  }}>
                  <UserInsightCard
                    insight={insight}
                  />
                </Card>
              )
            })
          }
        </ResponsiveGridLayout>
      }
    </div>
  )
}


