import { AlertService } from './alert.service';
import { Kafka, Consumer, ConsumerConfig } from 'kafkajs';
import { Alerts } from '@prisma/client';

export class ConsumerService {

    // private fafka: Kafka
    // private consumer: Consumer

    constructor() {

        // this.fafka = new Kafka({
        //     clientId: 'alert',
        //     brokers: ['kafka:9092'], // Connect to your broker(s),
        //     connectionTimeout: 6000,
        // });


        // const consumerConfig: ConsumerConfig = {
        //     groupId: 'alertGroup'
        // }

        // this.consumer = this.fafka.consumer(consumerConfig)

    }


    public async connectKafka() {
        // console.log('kafka connecting...')
        // await this.consumer.connect()
        // console.log('kafka connected')
        // await this.consumer.subscribe({ 'topic': 'AlertTopic' })
        // console.log('subscribed to topic')
    }


    public async startConsuming() {
        // this.consumer.run({
        //     eachMessage: async ({ topic, partition, message }) => {
        //         try {
        //             if (message.value != null) {
        //                 const alert: Alerts = JSON.parse(message.value.toString())

        //                 console.log(`Received message on ${topic}[${partition}]: ${message.value}`)
        //                 await AlertService.makeAlert(alert);
        //                 console.log(`Processed message: ${message.value}`)
                        
        //             }
        //         } catch (error) {
        //             console.log("Error processing kafka message", error);
        //         }
        //     }
        // })
    }


}