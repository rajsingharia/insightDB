import express, { NextFunction, Request, Response } from "express";
import prisma from "./config/database.config";
import Route from "./routes";
import ErrorHandlerRouter from "./util/errorHandling";
import createHttpError from "http-errors";
import { ValidateTokenMiddleware, ValidateTokenMiddlewareFromSSE } from "./middlewares/validateToken.middleware";

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
app.use('/api/v1/auth', Route.authRouter);
app.use('/api/v1/user', ValidateTokenMiddleware, Route.userRouter);
app.use('/api/v1/integrations', ValidateTokenMiddleware, Route.integrationRoute);
app.use('/api/v1/fetchData', ValidateTokenMiddleware, Route.fetchDataRoute);
app.use('/api/v1/insights', ValidateTokenMiddleware, Route.insightRoute);
app.use('/api/v1/charts', ValidateTokenMiddleware, Route.chartsRoute);
app.use('/api/v1/fetchSSEData', ValidateTokenMiddlewareFromSSE, Route.fetchDataRouteSSE);
app.use('/api/v1/alert', ValidateTokenMiddleware, Route.alertRouter)

const cronService = new CronService()
cronService.startAllCronJob()


// 404 handling
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, "Endpoint not found"));
});


// Error handling
app.use(ErrorHandlerRouter);


const PORT: number = parseInt(process.env.PORT!) || 3000;
app.listen(PORT!, () => {
    console.log(`Server is running on port ${PORT}`);
});