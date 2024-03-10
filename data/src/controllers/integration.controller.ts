import { Request, Response, NextFunction } from "express";
import { IntegrationService } from "../services/integration.service";
// import { OrganisationService } from "../services/org.service";
import createHttpError from "http-errors";
import { IntegrationDTO } from "../dto/request/integration.dto";
import { validate } from "class-validator";
import { Converter } from "../util/converters";


interface IAddIntegrationRequest extends Request {
    body: {
        userId: string,
        organisationId: string,
        integration: IntegrationDTO
    }
}



export class IntegrationController {

    public static async getAllIntegration(req: Request, res: Response, next: NextFunction) {
        try {
            const organisationId = req.body.organisationId;
            const allIntegrations = await IntegrationService.getOrganisationIntegrations(organisationId);
            if (!allIntegrations) throw createHttpError(404, "User not found");
            const response = allIntegrations.map((integration) => {
                return Converter.IntegrationEntityToIntegrationDto(integration)
            })
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public static async getIntegration(req: Request, res: Response, next: NextFunction) {
        try {
            const integrationId = req.params.id;
            const integration = await IntegrationService.getIntegrationById(integrationId);
            if (!integration) throw createHttpError(404, "Integration not found");
            const response = Converter.IntegrationEntityToIntegrationDto(integration)
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    // public static async checkConnection(req: IAddIntegrationRequest, res: Response, next: NextFunction): Promise<Response | void> {
    //     try {
    //         const organisationId = req.body.organisationId;
    //         const integration = req.body.integration;

    //         const validationErrors = await validate(integration);
    //         if (validationErrors.length > 0) {
    //             throw createHttpError(400, `Validation error: ${validationErrors}`);
    //         }

    //         const newIntegrationId = await IntegrationService.createIntegration(integration);
    //         if (!newIntegrationId) throw createHttpError(404, "Unable to create integration");
    //         await OrganisationService.addIntegration(organisationId, newIntegrationId);
    //         res.status(201).json({ integrationId: newIntegrationId });
    //     } catch (error) {
    //         next(error);
    //     }
    // }


    public static async addIntegration(req: IAddIntegrationRequest, res: Response, next: NextFunction) {
        try {
            const organisationId = req.body.organisationId;
            const integration = req.body.integration;

            const validationErrors = await validate(integration);
            if (validationErrors.length > 0) {
                throw createHttpError(400, `Validation error: ${validationErrors}`);
            }

            const newIntegrationId = await IntegrationService.createIntegration(organisationId, integration);
            if (!newIntegrationId) throw createHttpError(404, "Unable to create integration");
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
            const integrationId = req.params.id;
            
            await IntegrationService.deleteIntegrationById(integrationId);
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