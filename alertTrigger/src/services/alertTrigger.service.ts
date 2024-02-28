import axios from "axios";
import { Alerts } from "../types/alert.type";
import { createTransport } from 'nodemailer'
import { AlertTriggerResponse } from "../types/alertTriggerResponse.type";

export class AlertTriggerService {
    public static makeAlert = async (alert: Alerts): Promise<AlertTriggerResponse | undefined> => {

        const configurationObj = JSON.parse(JSON.stringify(alert.configuration))
        const alertId = alert.id

        if (alert.destination == 'EMAIL') {

            const message = configurationObj?.message
            const email = configurationObj?.email
            // Send an email
            const transporter = createTransport({
                host: "smtp:relay.sendinblue.com",
                port: 587,
                auth: {
                    user: email,
                    pass: process.env.SMTP_PASSWORD
                }
            })

            try {
                await transporter.sendMail({
                    from: "noreply.alert@insightdb.com",
                    to: email,
                    subject: "text",
                    html: message
                })

                return {
                    alertId: alertId,
                    isSuccessful: true,
                    errorMessage: ''
                }

            } catch (err: unknown) {
                return {
                    alertId: alertId,
                    isSuccessful: false,
                    errorMessage: err as string
                }
            }
        }
        else if (alert.destination === 'SLACK') {

            const messageFormat = configurationObj?.message
            const webHookUrlLink = configurationObj?.webhook

            if (!alertId || !messageFormat || !webHookUrlLink) {
                throw new Error("Fields missing while making alert on :" + alert.destination);
            }

            const response = await axios.post(webHookUrlLink, { text: messageFormat })
            console.log("Alert Cron Triggered For " + alertId + ": " + response.status)

            if (response.status == 200) {
                return {
                    alertId: alertId,
                    isSuccessful: true,
                    errorMessage: ''
                }
            } else {
                return {
                    alertId: alertId,
                    isSuccessful: false,
                    errorMessage: response.data.toString()
                }
            }

        }
    }
}