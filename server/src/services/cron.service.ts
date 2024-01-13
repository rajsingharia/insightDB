import cron from 'cron';
import { AlertService } from './alert.service';

export class CronService {

    private cronAlertMapping: Map<string, cron.CronJob>

    constructor() {
        this.cronAlertMapping = new Map<string, cron.CronJob>
    }


    public startAllCronJob() {
        // get all alerts (alertId, options, cronStringExp)
        const alerts: string[] = [];
        alerts.forEach((alertId) => {
            const refreshRate = 5 // fetch from alert
            const data = JSON.parse("{name: raj}")
            const alertJob = new cron.CronJob(`*/${refreshRate} * * * *`, () => {
                AlertService.makeAlert(data);
                // reduce the count of alert made
                // add this to alertPerformed DB
            });
            this.cronAlertMapping.set(alertId, alertJob)
        })

        this.cronAlertMapping.forEach((cronJob) => {
            cronJob.start()
        })

    }

    public startNewCronJon(alertId: string) {
        if (this.cronAlertMapping.get(alertId)) {
            this.cronAlertMapping.get(alertId)?.start()
            return
        }
        const refreshRate = 5 // fetch from alert
        const data = JSON.parse("{name: raj}")
        const alertJob = new cron.CronJob(`*/${refreshRate} * * * *`, () => {
            AlertService.makeAlert(data);
            // reduce the count of alert made
            // add this to alertPerformed DB
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