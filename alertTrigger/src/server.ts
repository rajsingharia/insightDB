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
import { ConsumerService } from "./services/consumer.service";
import cookieParser from "cookie-parser";



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
app.use('/api/v1/alertTrigger', ValidateTokenMiddleware, Route.alertRouter)

// app.use('/api/v1/charts', ValidateTokenMiddleware, Route.chartsRoute);
// app.use('/api/v1/fetchSSEData', ValidateTokenMiddlewareFromSSE, Route.fetchDataRouteSSE);

async function startCronService() {
    const cronService = new ConsumerService()
    await cronService.connectKafka()
    await cronService.startConsuming()
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