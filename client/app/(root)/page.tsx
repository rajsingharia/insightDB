"use client"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import CustomAxios from "../../utils/CustomAxios";
import IUserInsights from "../../interfaces/IUserInsights";
import { UserInsightCard } from "@/components/userInsightCard/UserInsightCard";
import { CircularProgress } from '@/components/common/CircularProgress';
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

import "../../node_modules/react-grid-layout/css/styles.css"
import "../../node_modules/react-resizable/css/styles.css"
import { Button } from "@/components/ui/button";
import { FolderPlus, Lock, Unlock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@radix-ui/react-scroll-area";


export default function Home() {

  const { user } = useContext(AuthContext);
  const [userInsights, setUserInsights] = useState<IUserInsights[] | undefined>(undefined);
  const [enableEdit, setEnableEdit] = useState<boolean>(false)
  const [changeLayout, setChangeLayout] = useState<GridLayout.Layout[] | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true);
  const [allDashboard, setAllDashboard] = useState<any[]>([])
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>()

  const [dashboardTitle, setDashboardTitle] = useState<string>()
  const [dashboardDescription, setDashboardDescription] = useState<string>()

  const { toast } = useToast()
  const orgAxios = CustomAxios.getOrgAxios();
  const fetchDataAxios = CustomAxios.getFetchDataAxios();

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true)
      try {
        const userInsightResponse = await fetchDataAxios.get('/insights/default')
        const insights = userInsightResponse.data;
        console.log("User Insights :: " + JSON.stringify(insights))
        setUserInsights(insights);

        const allDashboardResponse = await orgAxios.get('/dashboard/all');
        setAllDashboard(allDashboardResponse.data);

        const defaultDashboardResponse = await orgAxios.get('/dashboard/default');
        if (defaultDashboardResponse.data !== null) {
          setSelectedDashboardId(defaultDashboardResponse.data);
        }

      } catch (error: any) {
        console.error(error);
        if (error.response) {
          toast({ title: "Error : " + error.response.data });
        } else {
          toast({ title: "Error : " + error.message });
        }
      } finally {
        setLoading(false)
      }
    };

    fetchData()
  }, [])


  useEffect(() => {
    if (selectedDashboardId) {
      const fetchData = async () => {
        setLoading(true)
        try {
          const userInsightResponse = await fetchDataAxios.get(`/insights/dashboard/${selectedDashboardId}`)
          const insights = userInsightResponse.data;
          setUserInsights(insights);
  
        } catch (error: any) {
          console.error(error);
          if (error.response) {
            toast({ title: "Error fetching user Insight: " + error.response.data });
          } else {
            toast({ title: "Error fetching user Insight: " + error.message });
          }
        } finally {
          setLoading(false)
        }
      };
  
      fetchData()

    }
  }, [selectedDashboardId])

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

    fetchDataAxios.patch(`/insights/onLayoutChange/${insightId}`, body)
      .then((res) => {
        toast({ title: "Successfully Layout Changed ✨" })
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
    }
    setEnableEdit(state)
  }

  const addDashboard = () => {

    const body = {
      dashboard: {
        title: dashboardTitle,
        description: dashboardDescription
      }
    }

    orgAxios.post(`/dashboard`, body)
      .then((res) => {
        const dashboardAdded = res.data;
        setSelectedDashboardId(dashboardAdded.id);
        toast({ title: "Dashboard Added" })
      })
      .catch((err) => {
        toast({ title: "Error adding dashboard: " + err.message })
      })
  }

  return (
    <div className="flex flex-col w-full h-full">
      {
        <div className="flex flex-row-reverse mb-1 gap-2 items-center">
          {
            !loading  && (user.role === "ADMIN") && userInsights && userInsights.length > 0 &&
            <Button variant={enableEdit ? 'secondary' : 'destructive'} size="icon">
              {
                enableEdit ? (
                  <Unlock
                    onClick={() => changeEnableState(false)}
                    className="h-[1.25rem] w-[1.25rem] rotate-0 scale-100 transition-all"
                  />
                ) : (
                  <Lock
                    onClick={() => changeEnableState(true)}
                    className="h-[1.25rem] w-[1.25rem] rotate-0 scale-100 transition-all"
                  />
                )
              }
            </Button>
          }
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="icon">
                <FolderPlus className="h-[1.25rem] w-[1.25rem]"/>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Dashboard</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Input
                  id="title"
                  placeholder="Title"
                  value={dashboardTitle}
                  onChange={(event) => setDashboardTitle(event.target.value)} />
                <Input
                  id="description"
                  placeholder="Description"
                  value={dashboardDescription}
                  onChange={(event) => setDashboardDescription(event.target.value)} />
                <Button
                  onClick={addDashboard}>
                  Add
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Select
            value={selectedDashboardId}
            onValueChange={(value) => setSelectedDashboardId(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Dashboard" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Dashboard</SelectLabel>
                {
                  allDashboard?.map((dashboard) => {
                    return (
                      <SelectItem
                        key={dashboard.id}
                        value={dashboard.id}>
                        {dashboard.title}
                      </SelectItem>
                    )
                  })
                }
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-s text-muted-foreground grow">
            {user.organisationName}
          </p>
        </div>
      }
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
        <ScrollArea className="flex flex-col w-full h-full">
          <ResponsiveGridLayout
            className="layout"
            // cols={11}
            rowHeight={20}
            // width={1130}
            isDraggable={enableEdit}
            isResizable={enableEdit}
            onLayoutChange={onLayoutChange}>
            {
              userInsights?.map((insight) => {
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
        </ScrollArea>
      }
    </div>
  )
}


