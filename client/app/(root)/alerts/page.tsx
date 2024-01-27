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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input'
import { useToast } from "@/components/ui/use-toast"
import { CircularProgress } from '@/components/common/CircularProgress'


type AlertResponse = {
    id: string;
    userId: string;
    title: string;
    rawQuery: string;
    destination: string;
    configuration: JSON;
    cronExpression: string;
    repeatCount: number;
}

type alertTriggered = {
    id: string;
    alertId: string;
    isSuccessful: boolean;
    errorMessage: string;
    createdAt: string
}

export default function AlertsPage() {

    const [alerts, setAlerts] = useState<AlertResponse[]>()
    const [alertTriggers, setAlertTriggers] = useState<alertTriggered[]>()
    const axios = AuthAxios.getAuthAxios()
    // title!: string;
    // rawQuery!: string; 
    // destination!: AlertDestinations; 
    // configuration!: JsonValue; 
    // cronExpression!: string; 
    // repeatCount: number = 0; 
    const [title, setTitle] = useState<string>()
    const [rawQuery, setRawQuery] = useState<string>()
    const [destination, setDestination] = useState<string>()
    const [config, setConfig] = useState<string>()
    const [cronExp, setCronExp] = useState<string>()
    const [repeatCount, setRepeatCount] = useState<number>()
    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(true)


    useEffect(() => {
        axios.get('/alert')
            .then((response) => {
                setAlerts(response.data)
            })
            .catch((error) => {
                console.log("error")
                toast({ title: "Error fetching alerts : " + error.message })
            })
            .finally(() => {
                setLoading(false)
            })

        axios.get('/alert/alertTriggered')
            .then((response) => {
                setAlertTriggers(response.data)
            })
            .catch((error) => {
                console.log("error")
                toast({ title: "Error fetching alertTriggers : " + error.message })
            })
    }, [])

    const createNewAlert = () => {

        const body = {
            alert: {
                title: title,
                rawQuery: rawQuery,
                destination: destination,
                configuration: JSON.parse(JSON.stringify(config)),
                cronExpression: cronExp,
                repeatCount: repeatCount
            }
        }

        axios.post('/alert', body)
            .then((response) => {
                location.reload();
            })
            .catch((error) => {
                toast({ title: "Error creating alert : " + error.message })
            })
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
                                    <Input
                                        placeholder='Title'
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)} />
                                    <Input
                                        placeholder='Raw Query'
                                        value={rawQuery}
                                        onChange={(e) => setRawQuery(e.target.value)} />
                                    <Input
                                        placeholder='Destination'
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)} />
                                    <Input
                                        placeholder='Config'
                                        value={config}
                                        onChange={(e) => setConfig(e.target.value)} />
                                    <Input
                                        placeholder='Cron string'
                                        value={cronExp}
                                        onChange={(e) => setCronExp(e.target.value)} />
                                    <Input
                                        placeholder='Repeat'
                                        type='number'
                                        value={repeatCount}
                                        onChange={(e) => setRepeatCount(Number(e.target.value))} />
                                    <Button onClick={createNewAlert}>
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
                                    {
                                        alertTriggers &&
                                        <h1 className="text-4xl font-extrabold text-red-500">
                                            {`Successfully ${alertTriggers.filter(alertTrigger => alertTrigger.isSuccessful).length}`}
                                        </h1>
                                    }
                                </Card>
                                <Card className="flex items-center justify-center h-full w-1/2">
                                    {
                                        alertTriggers &&
                                        <h1 className="text-4xl font-extrabold text-green-500">
                                            {`Failure ${alertTriggers.filter(alertTrigger => !alertTrigger.isSuccessful).length}`}
                                        </h1>
                                    }
                                </Card>
                            </div>
                            <div className='flex h-1/2 p-1 bg-slate-500'>
                                {/* graph for all alert triggers*/}
                            </div>
                        </div>
                        <ScrollArea className='w-1/3'>
                            {
                                alerts &&
                                <Card className='p-1'>
                                    <Table>
                                        <TableCaption>A list of your alerts</TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">ID</TableHead>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Dest</TableHead>
                                                <TableHead />
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                alerts.map((alert) => (
                                                    <TableRow key={alert.id}>
                                                        <TableCell className="font-medium">{alert.id.slice(0, 8)}</TableCell>
                                                        <TableCell>{alert.title}</TableCell>
                                                        <TableCell>{alert.destination}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="link" onClick={() => {
                                                                //TODO: show alertTriggers for this alert
                                                            }}>Triggers</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </Card>
                            }
                        </ScrollArea>
                    </div>
                </div>
            }
        </>
    )
}
