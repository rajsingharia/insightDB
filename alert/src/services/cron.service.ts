import { CronJob } from 'cron';
import { AlertService } from './alert.service';
import { KafkaService } from './kafka.service';
import { Alerts } from '@prisma/client';
import { FetchDataProducer } from '../events/producers/FetchDataProducer';

export class CronService {

    private cronAlertMapping: Map<string, CronJob>
    private kafka: KafkaService

    constructor(kafka: KafkaService) {
        this.cronAlertMapping = new Map<string, CronJob>
        this.kafka = kafka
    }


    public async startAllCronJob() {
        const alerts = await AlertService.getAllAlerts();
        if (alerts.length > 0) {
            alerts.forEach((alert: Alerts) => {
                const alertJob = new CronJob(alert.cronExpression, async () => {
                    console.log("Sending alert for data fetching...")
                    await new FetchDataProducer(KafkaService.getInstance()).publish({ alert });
                    console.log("Successfully send alert data for fetching")
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
            new FetchDataProducer(KafkaService.getInstance()).publish({ alert });
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