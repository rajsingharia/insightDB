import { AlertTriggerService } from './alertTrigger.service';
import { Kafka, Consumer, ConsumerConfig, Producer } from 'kafkajs';

export class KafkaService {

    private fafka: Kafka
    private consumer: Consumer
    private producer: Producer

    constructor() {

        this.fafka = new Kafka({
            clientId: 'alert',
            brokers: ['kafka:9092'], // Connect to your broker(s),
            connectionTimeout: 6000,
        });

        this.producer = this.fafka.producer({ allowAutoTopicCreation: true })

        const consumerConfig: ConsumerConfig = {
            groupId: 'alertGroup'
        }

        this.consumer = this.fafka.consumer(consumerConfig)

    }


    public async connectKafka() {
        console.log('kafka connecting...')
        await this.consumer.connect()
        console.log('kafka connected')
        await this.consumer.subscribe({ 'topic': 'AlertTopic' })
        console.log('subscribed to topic')
    }


    public async startConsuming() {
        this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    if (message.value != null && topic === 'AlertTrigger') {
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