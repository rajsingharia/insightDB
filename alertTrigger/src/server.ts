import { AlertTriggerConsumer } from "./events/consumers/AlertTriggerConsumer";
import { KafkaService } from "./services/kafka.service";
import 'dotenv/config'

new KafkaService()
new AlertTriggerConsumer("alert-trigger-alert-trigger-consumer", KafkaService.getInstance()).listen()
