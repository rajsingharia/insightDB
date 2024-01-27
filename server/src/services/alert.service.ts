import axios from "axios";
import prisma from "../config/database.config";
import { AlertDTO } from "../dto/request/alert.dto";
import { Alerts } from "@prisma/client";

export class AlertService {

    private static prismaClient = prisma.getInstance();

    public static getAllAlerts = async () => {
        return this.prismaClient.alerts.findMany()
    }

    public static getAlertById = async (alertId: string) => {
        return this.prismaClient.alerts.findFirst({
            where: {
                id: alertId
            }
        })
    }

    public static addAlert = async (userId: string, newAlert: AlertDTO) => {
        const alert = await this.prismaClient.alerts.create({
            data: {
                userId: userId,
                title: newAlert.title,
                rawQuery: newAlert.rawQuery,
                destination: newAlert.destination,
                configuration: newAlert.configuration!,
                cronExpression: newAlert.cronExpression,
                repeatCount: newAlert.repeatCount
            }
        })

        return alert.id
    }

    public static changeAlertById = async (alertId:string, newAlert: AlertDTO) => {
        const alert = await this.prismaClient.alerts.update({
            where: {
                id: alertId
            },
            data: {
                title: newAlert.title,
                rawQuery: newAlert.rawQuery,
                cronExpression: newAlert.cronExpression,
                repeatCount: newAlert.repeatCount
            }
        })

        return alert.id

    }

    public static getAllAlertTriggers = async () => {
        const alertTriggers = await this.prismaClient.alertTriggered.findMany()
        return alertTriggers
    }

    public static getAlertTriggerByAlertId = async (alertId: string) => {
        const alertTriggers = await this.prismaClient.alertTriggered.findMany({
            where: {
                alertId: alertId
            }
        })
        return alertTriggers
    }

    public static getAlertTriggerById = async (id: string) => {
        const alertTriggers = await this.prismaClient.alertTriggered.findFirst({
            where: {
                id: id
            }
        })
        return alertTriggers
    }

    public static makeAlert = async (alert: Alerts) => {


        if (alert.destination == 'EMAIL') {
            // Send an email
        }
        else if (alert.destination === 'SLACK') {

            const configurationObj = JSON.parse(JSON.stringify(alert.configuration))

            const alertId = alert.id
            const messageFormat = configurationObj?.message
            const webHookUrlLink = configurationObj?.webhook

            if(!alertId || !messageFormat || !webHookUrlLink) {
                throw new Error("Fields missing while making alert on :" + alert.destination);
            }

            const response = await axios.post(webHookUrlLink, { text: messageFormat })

            if (response.status == 200) {

                const alert = await this.prismaClient.alerts.findFirst({
                    where: {
                        id: alertId
                    }
                })

                if(!alert) throw new Error("Alert not found");
                
                await this.prismaClient.alerts.update({
                    where: {
                        id: alertId
                    },
                    data: {
                        repeatCount: alert.repeatCount - 1
                    }
                })

                await this.prismaClient.alertTriggered.create({
                    data: {
                        alertId: alertId,
                        isSuccessful: true,
                        errorMessage: ''
                    }
                })

            } else {

                await this.prismaClient.alertTriggered.create({
                    data: {
                        alertId: alertId,
                        isSuccessful: false,
                        errorMessage: response.data.toString()
                    }
                })

            }

        }
    }
}