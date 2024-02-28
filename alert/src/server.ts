import express from "express";
import prisma from "./config/database.config";
import Route from "./routes";
import {
    ValidateTokenMiddleware,
    ErrorHandlerRouter,
    NotFoundRoute
} from "insightdb-common"

import morgan from "morgan";
import cors from "cors";
import { CronService } from "./services/cron.service";
import cookieParser from "cookie-parser";
import { KafkaService } from "./services/kafka.service";
import 'dotenv/config'
import { FetchDataConsumer } from "./events/consumers/FetchDataConsumer";
import { AlertTriggerConsumer } from "./events/consumers/AlertTriggerConsumer";


const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

prisma.connect();


// Routes
app.use('/api/v1/alert', ValidateTokenMiddleware, Route.alertRouter)


const kafka = new KafkaService()
new FetchDataConsumer("FetchDataConsumer", KafkaService.getInstance()).listen()
new AlertTriggerConsumer("AlertTriggerConsumer", KafkaService.getInstance()).listen()

async function startCronService() {
    const cronService = new CronService(kafka)
    await cronService.startAllCronJob()
}

startCronService()

// 404 handling
app.use(NotFoundRoute);

// Error handling
app.use(ErrorHandlerRouter);


const PORT: number = parseInt(process.env.PORT!) || 3002;
app.listen(PORT!, () => {
    console.log(`Server is running on port ${PORT}`);
});