import { CronJob } from 'cron';
import { AlertService } from './alert.service';
import { ProducerService } from './producer.service';

export class CronService {

    private cronAlertMapping: Map<string, CronJob>
    private producer: ProducerService

    constructor() {
        this.cronAlertMapping = new Map<string, CronJob>
        this.producer = new ProducerService()
    }


    public async connectKafkaProducer() {
        await this.producer.connectKafkaProducer()
    }

    public async startAllCronJob() {
        const alerts = await AlertService.getAllAlerts();
        if (alerts && alerts.length > 0) {
            alerts.forEach((alert) => {
                const alertJob = new CronJob(alert.cronExpression, async () => {
                    //AlertService.makeAlert(alert);
                    await this.producer.sendMessage(alert)
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
            await this.producer.sendMessage(alert)
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