import { AlertTriggerConsumer } from "./events/consumers/AlertTriggerConsumer";
import { KafkaService } from "./services/kafka.service";
import 'dotenv/config'

new KafkaService()
new AlertTriggerConsumer("AlertTriggerConsumer", KafkaService.getInstance()).listen()
