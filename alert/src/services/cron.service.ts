import { CronJob } from 'cron';
import { AlertService } from './alert.service';
import { KafkaService } from './kafka.service';
import { Alerts } from '@prisma/client';
import { FetchDataProducer } from '../events/producers/FetchDataProducer';

export class CronService {

    private cronAlertMapping: Map<string, CronJob>
    private fetchDataProducer: FetchDataProducer;

    constructor() {
        this.cronAlertMapping = new Map<string, CronJob>
        this.fetchDataProducer = new FetchDataProducer(KafkaService.getInstance());
    }

    public async startAllCronJob() {

        await this.fetchDataProducer.init();

        const alerts = await AlertService.getAllAlerts();
        if (alerts.length > 0) {
            alerts.forEach((alert: Alerts) => {
                const alertJob = new CronJob(alert.cronExpression, async () => {
                    const integration = await AlertService.getIntegrationFromAlert(alert.id)
                    if (integration != null) {
                        const data = {
                            alert: alert,
                            integrationId: integration.id
                        }
                        console.log("Sending alert data fetching :: ", data);
                        await this.fetchDataProducer.publish(data)
                        console.log("Successfully send alert data for fetching")
                    } else {
                        console.log("Integration for alert :: " + alert.id + " is not found.")
                    }

                });
                this.cronAlertMapping.set(alert.id, alertJob)
            })

            this.cronAlertMapping.forEach((cronJob, alertId) => {
                console.log("Starting cron job  for alertID :: " + alertId)
                cronJob.start()
            })
        }
    }


    public async startNewCronJon(alertId: string) {
        if (this.cronAlertMapping.get(alertId)) {
            this.cronAlertMapping.get(alertId)?.start()
            return
        }

        const alert = await AlertService.getAlertById(alertId)
        if (!alert) {
            throw new Error("Unable to find Alert")
        }

        const alertJob = new CronJob(alert.cronExpression, async () => {
            const integration = await AlertService.getIntegrationFromAlert(alert.id)
            await this.fetchDataProducer.publish({
                alert: alert,
                integrationId: integration?.id ?? ''
            })
        });
        this.cronAlertMapping.set(alertId, alertJob)
        this.cronAlertMapping.get(alertId)?.start()
    }

    public stopCronJon(alertId: string) {
        if (this.cronAlertMapping.get(alertId)) {
            this.startNewCronJon(alertId)
            return
        }
        this.cronAlertMapping.get(alertId)?.stop()
    }

}