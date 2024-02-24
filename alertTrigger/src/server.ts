import { KafkaService } from "./services/kafka.service";
import 'dotenv/config'

async function startKafkaService() {
    const cronService = new KafkaService()
    await cronService.connectKafka()
    await cronService.startConsuming()
}

startKafkaService()