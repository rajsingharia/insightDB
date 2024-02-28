import { NextFunction, Request, Response } from "express";
import { OrganisationService } from "../services/org.service";
import createHttpError from "http-errors";
import { validate } from "class-validator";
import { organisationDTO } from "../dto/request/org.dto";



interface getOrganisationRequest extends Request {
    body: {
        id: string
    }
}

interface createOrganisationRequest extends Request {
    body: {
        Organisation: organisationDTO
    }
}

interface UpdateOrganisationRequest extends Request {
    body: {
        id: string
        Organisation: organisationDTO
    }
}


export const getOrganisation = async (req: getOrganisationRequest, res: Response, next: NextFunction) => {
    try {
        const OrganisationId = req.body.id;
        if(!OrganisationId) throw createHttpError(401, "Organisation id is required");

        const Organisation = await OrganisationService.findOrganisationById(OrganisationId);
        if(!Organisation) throw createHttpError(404, "Organisation not found");

        res.status(200).send(Organisation);
    } catch (error) {
        next(error);
    }
}


export const createOrganisation = async (req: createOrganisationRequest, res: Response, next: NextFunction) => {
    try {
        const Organisation = req.body.Organisation;
        if(!Organisation) throw createHttpError(401, "Organisation is required");

        const OrganisationCreated = await OrganisationService.createOrganisation(Organisation);
        res.status(200).send(OrganisationCreated);
    } catch (error) {
        next(error);
    }
}

export const updateOrganisation = async (req: UpdateOrganisationRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.body.id;
        const Organisation = req.body.Organisation;

        const validationErrors = await validate(Organisation);
        if (validationErrors.length > 0) {
            throw createHttpError(400, `Validation error: ${validationErrors}`);
        }

        const updatedOrganisation = await OrganisationService.updateOrganisation(id, Organisation);
        res.status(200).send(updatedOrganisation);
    } catch (error) {
        next(error);
    }
}

export const deleteOrganisation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const Organisation = await OrganisationService.deleteOrganisationById(id);
        res.status(200).send(Organisation);
    } catch (error) {
        next(error);
    }
}