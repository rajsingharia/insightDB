import { NextFunction, Request, Response } from "express";
import { organisationService } from "../services/org.service";
import createHttpError from "http-errors";
import { validate } from "class-validator";
import { organisationDTO } from "../dto/request/org.dto";



interface getorganisationRequest extends Request {
    body: {
        id: string
    }
}

interface createorganisationRequest extends Request {
    body: {
        organisation: organisationDTO
    }
}

interface UpdateorganisationRequest extends Request {
    body: {
        id: string
        organisation: organisationDTO
    }
}


export const getorganisation = async (req: getorganisationRequest, res: Response, next: NextFunction) => {
    try {
        const organisationId = req.body.id;
        if(!organisationId) throw createHttpError(401, "organisation id is required");

        const organisation = await organisationService.findorganisationById(organisationId);
        if(!organisation) throw createHttpError(404, "organisation not found");

        res.status(200).send(organisation);
    } catch (error) {
        next(error);
    }
}


export const createorganisation = async (req: createorganisationRequest, res: Response, next: NextFunction) => {
    try {
        const organisation = req.body.organisation;
        if(!organisation) throw createHttpError(401, "organisation is required");

        const organisationCreated = await organisationService.createorganisation(organisation);
        res.status(200).send(organisationCreated);
    } catch (error) {
        next(error);
    }
}

export const updateorganisation = async (req: UpdateorganisationRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.body.id;
        const organisation = req.body.organisation;

        const validationErrors = await validate(organisation);
        if (validationErrors.length > 0) {
            throw createHttpError(400, `Validation error: ${validationErrors}`);
        }

        const updatedorganisation = await organisationService.updateorganisation(id, organisation);
        res.status(200).send(updatedorganisation);
    } catch (error) {
        next(error);
    }
}

export const deleteorganisation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const organisation = await organisationService.deleteorganisationById(id);
        res.status(200).send(organisation);
    } catch (error) {
        next(error);
    }
}