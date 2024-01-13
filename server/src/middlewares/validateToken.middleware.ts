import {Request, Response, NextFunction } from "express";
import { JWT } from "../security/jwt";
import createHttpError from "http-errors";

export const ValidateTokenMiddleware = async(req: Request,  res: Response, next: NextFunction) => {
    try {
        //const token = req.headers.authorization?.split(" ")[1];
        const token = req.cookies.token;
        if(!token) throw createHttpError(401, "Token is required");
        const isValid = await JWT.validateToken(token);
        if(!isValid) throw createHttpError(401, "Invalid token");
        const userId = await JWT.getUserIdFromToken(token);
        req.body.userId = userId;
        next();
    } catch (error) {
        next(error);
    }
}

export const ValidateTokenMiddlewareFromSSE = async(req: Request,  res: Response, next: NextFunction) => {
    try {

        //Find a way to retrieve token even with SSE connection

    } catch(error) {
        next(error);
    }
}