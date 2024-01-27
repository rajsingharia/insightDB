import cron from 'cron';
import { AlertService } from './alert.service';

export class CronService {

    private cronAlertMapping: Map<string, cron.CronJob>

    constructor() {
        this.cronAlertMapping = new Map<string, cron.CronJob>
    }


    public async startAllCronJob() {
        const alerts = await AlertService.getAllAlerts();
        if (alerts && alerts.length > 0) {
            // alerts.forEach((alert) => {
            //     const configuration = alert.configuration
            //     const alertJob = new cron.CronJob(alert.cronExpression, () => {
            //         AlertService.makeAlert(configuration);
            //     });
            //     this.cronAlertMapping.set(alert.id, alertJob)
            // })

            // this.cronAlertMapping.forEach((cronJob) => {
            //     cronJob.start()
            // })
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
        
        const alertJob = new cron.CronJob(alert.cronExpression, () => {
            AlertService.makeAlert(alert);
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