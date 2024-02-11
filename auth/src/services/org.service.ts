import { RegisterDTO } from "../dto/request/register.dto";
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
}
