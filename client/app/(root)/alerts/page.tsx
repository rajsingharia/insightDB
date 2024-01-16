'use client'

import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import AuthAxios from '@/utils/AuthAxios'
import { Card } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from 'lucide-react'
import { Label } from '@radix-ui/react-select'
import { Input } from '@/components/ui/input'

export default function AlertsPage() {

    const [alerts, setAlerts] = useState<any[]>()
    const [alertTriggers, setAlertTriggers] = useState<any[]>()


    useEffect(() => {
        const axios = AuthAxios.getAuthAxios()
        axios.get('/alert')
            .then((response) => {
                setAlerts(response.data)
            })
            .catch((error) => {
                console.log("error")
            })

        axios.get('/alert/alertTriggered')
            .then((response) => {
                setAlertTriggers(response.data)
            })
            .catch((error) => {
                console.log("error")
            })
    }, [])

    const createNewAlert = () => {
        
    }

    return (
        <div className='w-full h-full flex flex-col gap-1'>
            <div className='flex'>
                <Dialog>
                    <DialogTrigger>
                        <Button>
                            <PlusCircle className='mr-2 h-4 w-4' />Add Alert
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Alert</DialogTitle>
                        </DialogHeader>
                        <div className='flex flex-col gap-2'>
                            {/* model Alerts {
  id             String            @id @default(uuid())
  user           User              @relation(fields: [userId], references: [id])
  userId         String
  title          String
  rawQuery       String
  destination    AlertDestinations
  configuration  Json
  cronExpression String
  repeatCount    Int               @default(1)
  AlertTriggered AlertTriggered[]
} */}
                            <Input />
                            <Input />
                            <Input />
                            <Input />
                            <Input />
                            <Input />

                            <Button>
                                Save
                            </Button>

                        </div>
                    </DialogContent>
                </Dialog>

            </div>
            <div className='flex flex-row gap-4 w-full h-full'>
                <div className='flex flex-col gap-4 w-2/3 h-full'>
                    <div className='flex flex-row gap-4 h-1/2'>
                        <Card className="flex items-center justify-center h-full w-1/2">
                            <h1 className="text-4xl font-extrabold text-red-500">
                                Successful 24
                            </h1>
                        </Card>
                        <Card className="flex items-center justify-center h-full w-1/2">
                            <h1 className="text-4xl font-extrabold text-green-500">
                                Failure 12
                            </h1>
                        </Card>
                    </div>
                    <div className='flex h-1/2 p-1 bg-slate-500'>
                        {/* graph */}
                    </div>
                </div>
                <ScrollArea className='w-1/3'>
                    {/* Show table with alertTriggerId, alert Title, successful or not and associated alertId*/}
                    {
                        alerts?.map((alert, idx) => {
                            return (
                                <div key={idx}>
                                    {alert.toString()}
                                </div>
                            )
                        })
                    }
                </ScrollArea>
            </div>
        </div>
    )
}
