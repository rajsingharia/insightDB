import axios from "axios";
import prisma from "../config/database.config";
import { AlertDTO } from "../dto/response/alert.dto";
import { AlertDestinations } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

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

    public static addAlert = async (alertDestination: AlertDestinations, userId: string, newAlert: AlertDTO) => {
        const alert = await this.prismaClient.alerts.create({
            data: {
                userId: userId,
                title: newAlert.title,
                rawQuery: newAlert.rawQuery,
                destination: alertDestination,
                configuration: newAlert.configuration!,
                cronExpression: newAlert.cronExpression,
                repeatCount: newAlert.repeatCount
            }
        })

        return alert.id
    }

    public static changeAlertById = async (newAlert: AlertDTO) => {
        const alert = await this.prismaClient.alerts.update({
            where: {
                id: newAlert.id
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

    public static makeAlert = async (data: JsonValue) => {

        const dataObj = JSON.parse(JSON.stringify(data))

        if (dataObj.type == 'EMAIL') {
            // Send an email
        }
        else if (dataObj.type === 'SLACK') {

            const data = dataObj.data
            const alertId = dataObj.alertId
            const messageFormat = data.message
            const webHookUrlLink = data.webhook

            if(!data || !alertId || !messageFormat || !webHookUrlLink) {
                throw new Error("Fields missing while making alert on :" + dataObj.type);
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