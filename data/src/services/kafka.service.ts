import { Kafka } from 'kafkajs'
import fs from 'fs'
import path from 'path'

export class KafkaService {

    private static instance: KafkaService;
    private fafka: Kafka

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
    }

    static getInstance(): Kafka {
        if (!KafkaService.instance) {
            KafkaService.instance = new KafkaService();
        }

        return KafkaService.instance.fafka;
    }

}