'use client'

import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import CustomAxios from '@/utils/CustomAxios'
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
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input'
import { useToast } from "@/components/ui/use-toast"
import { CircularProgress } from '@/components/common/CircularProgress'
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { AlertCreationSectionOne } from '@/components/alert/AlertCreationSectionOne'
import { AlertCreationSectionTwo } from '@/components/alert/AlertCreationSectionTwo'
import { AlertTriggerChart } from '@/components/alert/AlertTriggerChart'


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

export type alertTriggered = {
    id: string;
    alertId: string;
    isSuccessful: boolean;
    errorMessage: string;
    createdAt: string
}

export default function AlertsPage() {

    const [alerts, setAlerts] = useState<AlertResponse[]>()
    const [alertTriggers, setAlertTriggers] = useState<alertTriggered[]>()
    const [alertTriggerCount, setAlertTriggerCount] = useState<{ successful: number, unsuccessful: number}>()

    //Section One
    const [title, setTitle] = useState<string>()
    const [integrationId, setIntegrationId] = useState<string>()
    const [rawQuery, setRawQuery] = useState<string>()

    //Section Two
    const [destination, setDestination] = useState<string>()
    const [row, setRow] = useState<string>()
    const [condition, setCondition] = useState<string>()
    const [value, setValue] = useState<string>()
    const [cronExp, setCronExp] = useState<string>()
    const [otherConfig, setOtherConfig] = useState<string>()
    const [repeatCount, setRepeatCount] = useState<number>()


    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(true)

    

    useEffect(() => {
        (
            async () => {
                const alertAxios = CustomAxios.getAlertAxios()
                setLoading(true)
                try {
                    const alertResponse = await alertAxios.get('/alert')
                    setAlerts(alertResponse.data)

                    const alertTriggersResponse = await alertAxios.get('/alert/alertTriggered')
                    setAlertTriggers(alertTriggersResponse.data)

                    const alertTriggerCountResponse = await alertAxios.get('/alert/alertTriggered/count')
                    setAlertTriggerCount(alertTriggerCountResponse.data)

                } catch (error: unknown) {
                    toast({ title: "Error : " + error })
                } finally {
                    setLoading(false)
                }

            }
        )();

    }, [toast])


    const createNewAlert = () => {

        const alertAxios = CustomAxios.getAlertAxios()
        const otherConfigJSON = JSON.parse(otherConfig!!)

        const config = {
            row: row,
            condition: condition,
            value: value,
            ...otherConfigJSON
        }

        const body = {
            alert: {
                title: title,
                integrationId: integrationId,
                rawQuery: rawQuery,
                destination: destination,
                configuration: config,
                cronExpression: cronExp,
                repeatCount: repeatCount
            }
        }

        alertAxios.post('/alert', body)
            .then((response) => {
                location.reload();
            })
            .catch((error) => {
                toast({ title: "Error creating alert : " + error.message })
            })
    }

    const carouselContentArray = [

        <AlertCreationSectionOne
            key={1}
            title={title}
            setTitle={setTitle}
            rawQuery={rawQuery}
            setRawQuery={setRawQuery}
            integrationId={integrationId}
            setIntegrationId={setIntegrationId} />,

        <AlertCreationSectionTwo
            key={2}
            destination={destination}
            setDestination={setDestination}
            row={row}
            setRow={setRow}
            condition={condition}
            setCondition={setCondition}
            value={value}
            setValue={setValue}
            otherConfig={otherConfig}
            setOtherConfig={setOtherConfig}
            cronExp={cronExp}
            setCronExp={setCronExp}
            repeatCount={repeatCount}
            setRepeatCount={setRepeatCount}
            createNewAlert={createNewAlert} />

    ]


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
                            <DialogContent className="w-[1000px]">
                                <DialogHeader>
                                    <DialogTitle>Add Alert</DialogTitle>
                                </DialogHeader>
                                <div className="w-full h-full">
                                    <Carousel className="w-full">
                                        <CarouselContent>
                                            {carouselContentArray.map((child, index) => (
                                                <CarouselItem key={index}>
                                                    {
                                                        child
                                                    }
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
                                </div>
                            </DialogContent>
                        </Dialog>

                    </div>
                    <div className='flex flex-row gap-4 w-full h-full'>
                        <div className='flex flex-col gap-4 w-2/3 h-full'>
                            <div className='flex flex-row gap-4 h-1/2'>
                                <Card className="flex items-center justify-center h-full w-1/2">
                                    {
                                        alertTriggerCount &&
                                        <h1 className="text-4xl font-extrabold text-green-500">
                                            {`Successfully ${alertTriggerCount?.successful}`}
                                        </h1>
                                    }
                                </Card>
                                <Card className="flex items-center justify-center h-full w-1/2">
                                    {
                                        alertTriggerCount &&
                                        <h1 className="text-4xl font-extrabold text-red-500">
                                            {`Failure ${alertTriggerCount?.unsuccessful}`}
                                        </h1>
                                    }
                                </Card>
                            </div>
                            <div className='h-1/2 p-1'>
                                {
                                    alertTriggers &&
                                    <Card className="flex items-center justify-center h-full w-full p-4">
                                        <AlertTriggerChart alertTriggers={alertTriggers} />
                                    </Card>
                                }
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
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="link">Triggers</Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <div className="flex flex-col gap-4 py-4">

                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
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
