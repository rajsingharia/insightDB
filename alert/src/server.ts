import express, { NextFunction, Request, Response } from "express";
import prisma from "./config/database.config";
import Route from "./routes";
import ErrorHandlerRouter from "./util/errorHandling";
import createHttpError from "http-errors";
import { ValidateTokenMiddleware } from "./middlewares/validateToken.middleware";

import morgan from "morgan";
import cors from "cors";
import { CronService } from "./services/cron.service";
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
app.use('/api/v1/alert', ValidateTokenMiddleware, Route.alertRouter)

// app.use('/api/v1/charts', ValidateTokenMiddleware, Route.chartsRoute);
// app.use('/api/v1/fetchSSEData', ValidateTokenMiddlewareFromSSE, Route.fetchDataRouteSSE);

const cronService = new CronService()
cronService.startAllCronJob()


// 404 handling
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, "Endpoint not found"));
});


// Error handling
app.use(ErrorHandlerRouter);


const PORT: number = parseInt(process.env.PORT!) || 3002;
app.listen(PORT!, () => {
    console.log(`Server is running on port ${PORT}`);
});