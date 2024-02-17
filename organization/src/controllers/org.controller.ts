import { NextFunction, Request, Response } from "express";
import { OrganizationService } from "../services/org.service";
import createHttpError from "http-errors";
import { validate } from "class-validator";
import { OrganizationDTO } from "../dto/request/org.dto";



interface getOrganizationRequest extends Request {
    body: {
        id: string
    }
}

interface createOrganizationRequest extends Request {
    body: {
        organization: OrganizationDTO
    }
}

interface UpdateOrganizationRequest extends Request {
    body: {
        id: string
        organization: OrganizationDTO
    }
}


export const getOrganization = async (req: getOrganizationRequest, res: Response, next: NextFunction) => {
    try {
        const organizationId = req.body.id;
        if(!organizationId) throw createHttpError(401, "Organization id is required");

        const organization = await OrganizationService.findOrganizationById(organizationId);
        if(!organization) throw createHttpError(404, "Organization not found");

        res.status(200).send(organization);
    } catch (error) {
        next(error);
    }
}


export const createOrganization = async (req: createOrganizationRequest, res: Response, next: NextFunction) => {
    try {
        const organization = req.body.organization;
        if(!organization) throw createHttpError(401, "Organization is required");

        const organizationCreated = await OrganizationService.createOrganization(organization);
        res.status(200).send(organizationCreated);
    } catch (error) {
        next(error);
    }
}

export const updateOrganization = async (req: UpdateOrganizationRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.body.id;
        const organization = req.body.organization;

        const validationErrors = await validate(organization);
        if (validationErrors.length > 0) {
            throw createHttpError(400, `Validation error: ${validationErrors}`);
        }

        const updatedOrganization = await OrganizationService.updateOrganization(id, organization);
        res.status(200).send(updatedOrganization);
    } catch (error) {
        next(error);
    }
}

export const deleteOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const organization = await OrganizationService.deleteOrganizationById(id);
        res.status(200).send(organization);
    } catch (error) {
        next(error);
    }
}