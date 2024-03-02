import express from "express";
import Route from "./routes";
import {
    ValidateTokenMiddleware,
    ErrorHandlerRouter,
    NotFoundRoute
} from "insightdb-common"
import prisma from "./config/database.config";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config'
import { KafkaService } from "./services/kafka.service";
import { FetchDataConsumer } from "./events/consumers/FetchDataConsumer";

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


new KafkaService()
new FetchDataConsumer("data-fetch-data-consumer", KafkaService.getInstance()).listen()

// Routes
app.use(ValidateTokenMiddleware)
app.use('/api/v1/fetchData', Route.fetchDataRoute);
app.use('/api/v1/checkConnection', Route.checkConnectionRoute);
app.use('/api/v1/integrations', Route.integrationRoute);
app.use('/api/v1/insights', Route.insightRoute);


// 404 handling
app.use(NotFoundRoute);

// Error handling
app.use(ErrorHandlerRouter);

const PORT: number = parseInt(process.env.PORT!) || 3001;
app.listen(PORT!, () => {
    console.log(`Server is running on port ${PORT}`);
});