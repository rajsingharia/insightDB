import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { validate } from "class-validator";
import { AlertService } from "../services/alert.service";
import { AlertDTO } from "../dto/request/alert.dto";

interface IAddAlertRequest extends Request {
    body: {
        userId: string;
        alert: AlertDTO
    }
}

interface IUpdateAlertRequest extends Request {
    body: {
        alert: AlertDTO;
    },
    params: {
        alertId: string;
    }
}


export const getAlerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response: AlertDTO[] = await AlertService.getAllAlerts()
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
}


export const addAlerts = async (req: IAddAlertRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.userId
        const newAlert = req.body.alert
        const response = await AlertService.addAlert(userId, newAlert)
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
}

export const updateAlert = async (req: IUpdateAlertRequest, res: Response, next: NextFunction) => {
    try {
        // const userId  = req.params.id;
        const updateAlertDto = req.body.alert;
        const alertId = req.params.alertId

        const validationErrors = await validate(updateAlertDto);
        if (validationErrors.length > 0) {
            throw createHttpError(400, `Validation error: ${validationErrors}`);
        }

        const response = await AlertService.changeAlertById(alertId, updateAlertDto);
        res.status(200).send(response);
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