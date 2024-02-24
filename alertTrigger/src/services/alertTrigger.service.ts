import axios from "axios";
import { Alerts } from "../types/alert.type";
import { createTransport } from 'nodemailer'

export class AlertTriggerService {
    public static makeAlert = async (alert: Alerts) => {

        const configurationObj = JSON.parse(JSON.stringify(alert.configuration))
        const alertId = alert.id

        if (alert.destination == 'EMAIL') {
            // Send an email
            const transporter = createTransport({
                host: "smtp:relay.sendinblue.com",
                port: 587,
                auth: {
                    user: "test@test.com",
                    pass: process.env.SMTP_PASSWORD
                }
            })

            try {
                await transporter.sendMail({
                    from: "noreply.alert@insightdb.com",
                    to: "test@gmail.com",
                    subject: "text",
                    html: ""
                })

                return {
                    alertId: alertId,
                    isSuccessful: true,
                    errorMessage: ''
                }

            } catch (err: any) {
                return {
                    alertId: alertId,
                    isSuccessful: false,
                    errorMessage: err.message.toString()
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