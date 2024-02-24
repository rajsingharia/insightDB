import { Consumer, ConsumerConfig, Kafka, Producer } from 'kafkajs'
import { AlertService } from './alert.service';

export class KafkaService {

    private fafka: Kafka
    private producer: Producer
    private consumer: Consumer

    constructor() {
        this.fafka = new Kafka({
            clientId: 'alert',
            brokers: ['kafka:9092'] // Connect to your broker(s)
        });
        this.producer = this.fafka.producer({ allowAutoTopicCreation: true })
        const consumerConfig: ConsumerConfig = {
            groupId: 'alertGroup'
        }

        this.consumer = this.fafka.consumer(consumerConfig)
    }

    public async connectKafkaProducer() {
        console.log("Connecting Kafka Producer...")
        await this.producer.connect()
        console.log("Connected Kafka Producer")
    }

    public startConsuming() {
        this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    if (message.value != null && topic === 'AlertResponse') {
                        const alertData = JSON.parse(
                            Buffer.from(message.value).toString('utf8')
                        )
                        console.log(`Received message on ${topic}[${partition}]: ${message.value}`)
                        await AlertService.addAlertTrigger(alertData)
                    }
                } catch (error) {
                    console.log("Error processing kafka message", error);
                }
            }
        })
    }

    public async sendMessage(message: unknown) {
        console.log(`Sending message for alert ${alert} on topic: alertTrigger`);
        await this.producer.send({
            topic: 'alertTrigger',
            messages: [{
                value: JSON.stringify(message),
            }]
        })
        console.log('Message sent');
    }

}