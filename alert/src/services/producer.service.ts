import { Kafka, Producer } from 'kafkajs'

export class ProducerService {

    private fafka: Kafka
    private producer: Producer

    constructor() {
        this.fafka = new Kafka({
            clientId: 'alert',
            brokers: ['kafka:9092'] // Connect to your broker(s)
        });
        this.producer = this.fafka.producer({ allowAutoTopicCreation: false })
    }

    public async connectKafkaProducer() {
        console.log("Connecting Kafka Producer...")
        await this.producer.connect()
        console.log("Connected Kafka Producer")
    }

    public async sendMessage(message: unknown) {
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