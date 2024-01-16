import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { validate } from "class-validator";
import { AlertService } from "../services/alert.service";
import { AlertDTO } from "../dto/response/alert.dto";


export const getAlerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response: AlertDTO[] = await AlertService.getAllAlerts()
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
}

export const updateAlert = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const userId  = req.params.id;
        const updateAlertDto: AlertDTO = req.body;

        const validationErrors = await validate(updateAlertDto);
        if (validationErrors.length > 0) {
            throw createHttpError(400, `Validation error: ${validationErrors}`);
        }

        const alertId = await AlertService.changeAlertById(updateAlertDto);
        res.status(200).send(alertId);
    } catch (error) {
        next(error);
    }
}

export const deleteAlert = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const id = req.params.id;
        // const user = await UserService.deleteUserById(id);
        // const response: UserDTO = Converter.UserEntityToUserDto(user);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
}

export const getAllAlertTriggers = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await AlertService.getAllAlertTriggers()
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
}

export const getAlertTriggers = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const alertId = req.params.id;

        if(!alertId) {
            throw createHttpError(400, `AlertId required`);
        }

        const response = await AlertService.getAlertTriggerByAlertId(alertId)
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
}