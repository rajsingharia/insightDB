import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { validate } from "class-validator";
import { AlertService } from "../services/alert.service";
import { AlertDTO } from "../dto/request/alert.dto";


export const getAlerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organisationId = req.body.organisationId;
        const response = await AlertService.getAllOrganisationAlerts(organisationId)
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
}


export const addAlerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.body.userId
        const newAlert: AlertDTO = req.body.alert
        const organisationId = req.body.organisationId;

        const validationErrors = await validate(newAlert);
        if (validationErrors.length > 0) {
            throw createHttpError(400, `Validation error: ${validationErrors}`);
        }

        const response = await AlertService.addAlert(userId, organisationId, newAlert)
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
}

export const updateAlert = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const userId  = req.params.id;
        const updateAlertDto: AlertDTO = req.body.alert;
        const alertId: string = req.params.alertId

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
        const organisationId = req.body.organisationId;
        const response = await AlertService.getAllAlertTriggers(organisationId)
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
}

export const getAllAlertTriggersCount = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const organisationId = req.body.organisationId;
        const response = await AlertService.getAlertTriggersCount(organisationId)
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