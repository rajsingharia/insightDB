import { CronJob } from 'cron';
import { AlertService } from './alert.service';
import { Kafka, Producer } from 'kafkajs'

export class ProducerService {

    private fafka: Kafka
    private producer: Producer

    constructor() {
        this.fafka = new Kafka({
            clientId: 'alert',
            brokers: ['localhost:9092'] // Connect to your broker(s)
        });
        this.producer = this.fafka.producer({ allowAutoTopicCreation: false })
    }

    public async sendMessage(message: any) {
        console.log(`Sending message for alert ${alert} on topic: alertTopic`);
        await this.producer.send({
            topic: 'alertTopic',
            messages: [{
                value: JSON.stringify(message),
            }]
        })
        console.log('Message sent');
    }
    
}