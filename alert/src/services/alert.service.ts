import prisma from "../config/database.config";
import { AlertDTO } from "../dto/request/alert.dto";
import { AlertTriggerDTO } from "../dto/request/alertTrigger";

export class AlertService {

    private static prismaClient = prisma.getInstance();

    public static getAllAlerts = async () => {
        return await this.prismaClient.alerts.findMany()
    }

    public static getAlertById = async (alertId: string) => {
        return await this.prismaClient.alerts.findFirst({
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
                repeatCount: newAlert.repeatCount,
                integration: {
                    connect: {
                        id: newAlert.integrationId
                    }
                }
            }
        })

        return alert.id
    }

    public static addAlertTrigger = async (newTriggerAlert: AlertTriggerDTO) => {

        const alert = await this.prismaClient.alerts.findFirst({
            where: {
                id: newTriggerAlert.alertId
            }
        })

        if (!alert) throw new Error("Alert not found");

        await this.prismaClient.alerts.update({
            where: {
                id: newTriggerAlert.alertId
            },
            data: {
                repeatCount: alert.repeatCount - 1
            }
        })

        const alertTrigger = await this.prismaClient.alertTriggered.create({
            data: {
                alertId: newTriggerAlert.alertId,
                isSuccessful: newTriggerAlert.isSuccessful,
                errorMessage: newTriggerAlert.errorMessage
            }
        })

        return alertTrigger.id
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

    public static getIntegrationFromAlert = async (alertId: string) => {
        const alert = await this.prismaClient.alerts.findFirst({
            where: {
                id: alertId
            },
            include: {
                integration: true
            }
        })
        return alert?.integration;
    }

}