import { Request, Response, NextFunction } from "express";
import { IntegrationService } from "../services/integration.service";
import { OrganizationService } from "../services/org.service";
import createHttpError from "http-errors";
import { IntegrationDTO } from "../dto/request/integration.dto";
import { validate } from "class-validator";


interface IAddIntegrationRequest extends Request {
    body: {
        userId: string,
        organizationId: string,
        integration: IntegrationDTO
    }
}



export class IntegrationController {

    public static async getAllIntegration(req: Request, res: Response, next: NextFunction) {
        try {
            const organizationId = req.body.organizationId;
            const allIntegrations = await OrganizationService.getOrganizationIntegrations(organizationId);
            if (!allIntegrations) throw createHttpError(404, "User not found");
            res.status(200).json(allIntegrations);
        } catch (error) {
            next(error);
        }
    }

    public static async getIntegration(req: Request, res: Response, next: NextFunction) {
        try {
            const organizationId = req.body.organizationId;
            const integrationId = req.params.id;
            const integration = await OrganizationService.getOrganizationIntegrationById(organizationId, integrationId);
            if (!integration) throw createHttpError(404, "Integration not found");
            res.status(200).json(integration);
        } catch (error) {
            next(error);
        }
    }

    public static async checkConnection(req: IAddIntegrationRequest, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const organizationId = req.body.organizationId;
            const integration = req.body.integration;

            const validationErrors = await validate(integration);
            if (validationErrors.length > 0) {
                throw createHttpError(400, `Validation error: ${validationErrors}`);
            }

            const newIntegrationId = await IntegrationService.createIntegration(integration);
            if (!newIntegrationId) throw createHttpError(404, "Unable to create integration");
            await OrganizationService.addIntegration(organizationId, newIntegrationId);
            res.status(201).json({ integrationId: newIntegrationId });
        } catch (error) {
            next(error);
        }
    }


    public static async addIntegration(req: IAddIntegrationRequest, res: Response, next: NextFunction) {
        try {
            const organizationId = req.body.organizationId;
            const integration = req.body.integration;

            const validationErrors = await validate(integration);
            if (validationErrors.length > 0) {
                throw createHttpError(400, `Validation error: ${validationErrors}`);
            }

            const newIntegrationId = await IntegrationService.createIntegration(integration);
            if (!newIntegrationId) throw createHttpError(404, "Unable to create integration");
            await OrganizationService.addIntegration(organizationId, newIntegrationId);
            res.status(201).json({ integrationId: newIntegrationId });
        } catch (error) {
            next(error);
        }

    }

    public static async updateIntegration(req: Request, res: Response, next: NextFunction) {
        try {
            const integrationId = req.params.id;
            const integration = req.body.integration;

            const validationErrors = await validate(integration);
            if (validationErrors.length > 0) {
                throw createHttpError(400, `Validation error: ${validationErrors}`);
            }

            const updatedIntegrationId = await IntegrationService.updateIntegration(integrationId, integration);
            if (!updatedIntegrationId) throw createHttpError(404, "Unable to update integration");
            res.status(200).json({ integrationId: updatedIntegrationId });
        } catch (error) {
            next(error);
        }
    }

    public static async deleteIntegration(req: Request, res: Response, next: NextFunction) {
        try {
            const organizationId = req.body.organizationId;
            const integrationId = req.params.id;
            
            await OrganizationService.removeIntegration(organizationId, integrationId);
            await IntegrationService.deleteIntegrationById(integrationId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    public static async getSupportedIntegration(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await IntegrationService.getSupportedIntegrations();
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

}