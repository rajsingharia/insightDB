import prisma from "../config/database.config";
import createHttpError from "http-errors";
import { OrganizationDTO } from "../dto/request/org.dto";


export class OrganizationService {

    private static prismaClient = prisma.getInstance();

    public static createOrganization = async (organization: OrganizationDTO) => {
        const savedUser = await this.prismaClient.organisation.create({
            data: {
                name: organization.organizationName
            }
        });
        return savedUser;
    }

    public static findOrganizationById = async (id: string) => {
        const user = await this.prismaClient.organisation.findUnique({
            where: {
                id: id
            }
        });
        if (!user) throw createHttpError(404, "Organization not found");
        return user;
    }

    public static findOrganizationByName = async (name: string) => {
        const user = await this.prismaClient.organisation.findUnique({
            where: {
                name: name
            }
        });
        if (!user) throw createHttpError(404, "Organization not found");
        return user;
    }

    public static updateOrganization = async (id: string, organisation: OrganizationDTO) => {
        const updatedUser = await this.prismaClient.organisation.update({
            where: {
                id: id
            },
            data: {
                name: organisation.organizationName
            }
        });
        return updatedUser;
    }

    public static deleteOrganizationById = async (id: string) => {
        const deletedUser = await this.prismaClient.organisation.delete({
            where: {
                id: id
            }
        });
        return deletedUser;
    }


    public static alreadyExists = async (organizationName: string) => {
        const existingUser = await this.prismaClient.organisation.findUnique({
            where: {
                name: organizationName
            }
        });
        return existingUser ? true : false;
    }

    public static addIntegration = async (organizationId: string, integrationId: string) => {
        try {
            const organization = await this.prismaClient.organisation.findUnique({
                where: { id: organizationId },
                include: { integrations: true }, // Include existing integrations for the organization
            });

            if (!organization) {
                throw new Error(`Organization with id ${organizationId} not found`);
            }

            const existingIntegration = organization.integrations.find((integration) => integration.id === integrationId);

            if (existingIntegration) {
                console.log(`Integration with id ${integrationId} already associated with the organization`);
                return;
            }

            await this.prismaClient.organisation.update({
                where: { id: organizationId },
                data: {
                    integrations: {
                        connect: { id: integrationId },
                    },
                },
            });

        } catch (error) {
            console.error('Error adding integration to organization:', error);
        }
    }

    public static removeIntegration = async (organizationId: string, integrationId: string) => {
        try {
            const organization = await this.prismaClient.organisation.findUnique({
                where: { id: organizationId },
                include: { integrations: true }, // Include existing integrations for the organization
            });

            if (!organization) {
                throw new Error(`Organization with id ${organizationId} not found`);
            }

            const existingIntegration = organization.integrations.find((integration) => integration.id === integrationId);

            if (!existingIntegration) {
                console.log(`Integration with id ${integrationId} is not associated with the organization`);
                return;
            }

            await this.prismaClient.organisation.update({
                where: { id: organizationId },
                data: {
                    integrations: {
                        disconnect: { id: integrationId },
                    },
                },
            });

        } catch (error) {
            console.error('Error removing integration from organization:', error);
        }
    }

    public static getOrganizationIntegrations = async (organizationId: string) => {
        const organization = await this.prismaClient.organisation.findUnique({
            where: {
                id: organizationId
            },
            include: {
                integrations: true
            }
        });
        if (!organization) throw createHttpError(404, "Organization not found");
        return organization.integrations;
    }

    public static getOrganizationIntegrationById = async (organizationId: string, integrationId: string) => {
        const organization = await this.prismaClient.organisation.findUnique({
            where: {
                id: organizationId
            },
            include: {
                integrations: {
                    where: {
                        id: integrationId
                    }
                }
            }
        });
        if (!organization) throw createHttpError(404, "Organization not found");
        return organization.integrations[0];


        // this.prismaClient.integration.findMany({
        //     where: {
        //         user: {
        //             id: user.id

        //         }
        //     }
        // })

    }

}
