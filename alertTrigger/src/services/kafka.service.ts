import { AlertTriggerService } from './alertTrigger.service';
import { Kafka, Consumer, ConsumerConfig, Producer } from 'kafkajs';
import fs from 'fs'
import path from 'path'

export class KafkaService {

    private fafka: Kafka
    private consumer: Consumer
    private producer: Producer

    constructor() {

        this.fafka = new Kafka({
            brokers: [process.env.BROKER!], // Connect to your broker(s)
            ssl: {
                ca: [fs.readFileSync(path.resolve('./ca.pem'), 'utf-8')],
            },
            sasl: {
                username: process.env.KAFKA_USERNAME!,
                password: process.env.KAFKA_PASSWORD!,
                mechanism: 'plain',
            }
        });

        this.producer = this.fafka.producer({ allowAutoTopicCreation: true })

        const consumerConfig: ConsumerConfig = {
            groupId: 'alertTriggerGroup'
        }

        this.consumer = this.fafka.consumer(consumerConfig)

    }


    public async connectKafka() {
        console.log('kafka connecting...')
        await this.consumer.connect()

        console.log('kafka consumer connected!!!')
        await this.consumer.subscribe({ 'topic': 'AlertTrigger' })
        console.log('subscribed to topic')

        await this.producer.connect()
        console.log('kafka producer connected!!!')
    }

    public async startConsuming() {
        this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    if (message.value != null) {
                        const alert = JSON.parse(
                            Buffer.from(message.value).toString('utf8')
                        )
                        console.log(`Received message on ${topic}[${partition}]: ${message.value}`)
                        const response = await AlertTriggerService.makeAlert(alert);
                        this.sendMessage(response)
                    }
                } catch (error) {
                    console.log("Error processing kafka message", error);
                }
            }
        })
    }

    private async sendMessage(message: unknown) {
        console.log(`Sending message for alert ${alert} on topic: AlertResponse`);
        await this.producer.send({
            topic: 'AlertResponse',
            messages: [{
                value: JSON.stringify(message),
            }]
        })
        console.log('Message sent');
    }

}