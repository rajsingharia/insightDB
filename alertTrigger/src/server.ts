import { KafkaService } from "./services/kafka.service";

async function startKafkaService() {
    const cronService = new KafkaService()
    await cronService.connectKafka()
    await cronService.startConsuming()
}

startKafkaService()