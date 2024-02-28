import prisma from "../config/database.config";
import createHttpError from "http-errors";
import { organisationDTO } from "../dto/request/org.dto";


export class OrganisationService {

    private static prismaClient = prisma.getInstance();

    public static createOrganisation = async (organisation: organisationDTO) => {
        const savedUser = await this.prismaClient.organisation.create({
            data: {
                name: organisation.organisationName
            }
        });
        return savedUser;
    }

    public static findOrganisationById = async (id: string) => {
        const organisation = await this.prismaClient.organisation.findUnique({
            where: {
                id: id
            }
        });
        if (!organisation) throw createHttpError(404, "organisation not found");
        return organisation;
    }

    public static findOrganisationByName = async (name: string) => {
        const user = await this.prismaClient.organisation.findUnique({
            where: {
                name: name
            }
        });
        if (!user) throw createHttpError(404, "organisation not found");
        return user;
    }

    public static updateOrganisation = async (id: string, organisation: organisationDTO) => {
        const updatedUser = await this.prismaClient.organisation.update({
            where: {
                id: id
            },
            data: {
                name: organisation.organisationName
            }
        });
        return updatedUser;
    }

    public static deleteOrganisationById = async (id: string) => {
        const deletedUser = await this.prismaClient.organisation.delete({
            where: {
                id: id
            }
        });
        return deletedUser;
    }


    public static alreadyExists = async (organisationName: string) => {
        const existingUser = await this.prismaClient.organisation.findUnique({
            where: {
                name: organisationName
            }
        });
        return existingUser ? true : false;
    }

    public static addIntegration = async (organisationId: string, integrationId: string) => {
        try {
            const organisation = await this.prismaClient.organisation.findUnique({
                where: { id: organisationId },
                include: { integrations: true }, // Include existing integrations for the organisation
            });

            if (!organisation) {
                throw new Error(`organisation with id ${organisationId} not found`);
            }

            const existingIntegration = organisation.integrations.find((integration) => integration.id === integrationId);

            if (existingIntegration) {
                console.log(`Integration with id ${integrationId} already associated with the organisation`);
                return;
            }

            await this.prismaClient.organisation.update({
                where: { id: organisationId },
                data: {
                    integrations: {
                        connect: { id: integrationId },
                    },
                },
            });

        } catch (error) {
            console.error('Error adding integration to organisation:', error);
        }
    }

    public static removeIntegration = async (organisationId: string, integrationId: string) => {
        try {
            const organisation = await this.prismaClient.organisation.findUnique({
                where: { id: organisationId },
                include: { integrations: true }, // Include existing integrations for the organisation
            });

            if (!organisation) {
                throw new Error(`organisation with id ${organisationId} not found`);
            }

            const existingIntegration = organisation.integrations.find((integration) => integration.id === integrationId);

            if (!existingIntegration) {
                console.log(`Integration with id ${integrationId} is not associated with the organisation`);
                return;
            }

            await this.prismaClient.organisation.update({
                where: { id: organisationId },
                data: {
                    integrations: {
                        disconnect: { id: integrationId },
                    },
                },
            });

        } catch (error) {
            console.error('Error removing integration from organisation:', error);
        }
    }

    public static getOrganisationIntegrations = async (organisationId: string) => {
        const organisation = await this.prismaClient.organisation.findUnique({
            where: {
                id: organisationId
            },
            include: {
                integrations: true
            }
        });
        if (!organisation) throw createHttpError(404, "organisation not found");
        return organisation.integrations;
    }

    public static getOrganisationIntegrationById = async (organisationId: string, integrationId: string) => {
        const organisation = await this.prismaClient.organisation.findUnique({
            where: {
                id: organisationId
            },
            include: {
                integrations: {
                    where: {
                        id: integrationId
                    }
                }
            }
        });
        if (!organisation) throw createHttpError(404, "organisation not found");
        return organisation.integrations[0];


        // this.prismaClient.integration.findMany({
        //     where: {
        //         user: {
        //             id: user.id

        //         }
        //     }
        // })

    }

}
