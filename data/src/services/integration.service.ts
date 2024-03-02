import createHttpError from "http-errors";
import prisma from "../config/database.config";
import { IntegrationDTO } from "../dto/request/integration.dto";
import { ListOfSupportedIntegrations } from "insightdb-common"



export class IntegrationService {

    private static prismaClient = prisma.getInstance();


    public static async getIntegrationById(integrationId: string) {
        const integration = await this.prismaClient.integration.findFirstOrThrow({
            where: {
                id: integrationId
            }
        });
        if(!integration) throw createHttpError("Integration not found")
        return integration;
    }


    public static async getOrganisationIntegrations(organisationId: string) {
        const allIntegrations = await this.prismaClient.integration.findMany({
            where: {
                organisationId: organisationId
            }
        })
        return allIntegrations
    }

    public static async createIntegration(organisationId: string, integration: IntegrationDTO): Promise<string> {
        const updatedUser = await this.prismaClient.integration.create({
            data: {
                name: integration.name,
                type: integration.type,
                credentials: integration.credentials,
                Organisation: {
                    connect: { id: organisationId }
                }
            }
        });
        return updatedUser.id;
    }

    public static async updateIntegration(integrationId: string, integration: IntegrationDTO): Promise<string> {
        const updatedUser = await this.prismaClient.integration.update({
            where: {
                id: integrationId
            },
            data: {
                name: integration.name,
                type: integration.type,
                credentials: integration.credentials 
            }
        });
        return updatedUser.id;
    }

    public static async deleteIntegrationById(integrationId: string): Promise<string> {
        const deletedIntegration = await this.prismaClient.integration.delete({
            where: {
                id: integrationId
            }
        });
        return deletedIntegration.id;
    }

    public static async getSupportedIntegrations(): Promise<unknown> {
        return ListOfSupportedIntegrations;
    }

    public static async getIntegrationTypeByIntegrationId(integrationId: string): Promise<string> {
        const integration = await this.prismaClient.integration.findUnique({
            where: {
                id: integrationId
            }
        });
        if(!integration) throw createHttpError(404, "Integration not found");
        return integration.type;
    }
}

