/* eslint-disable @typescript-eslint/no-unused-vars */
import { RegisterDTO } from "../dto/request/register.dto";
import prisma from "../config/database.config";
import createHttpError from "http-errors";
import { UpdateUserDTO } from "../dto/request/updateUser.dto";
import { Role } from "@prisma/client";


export class UserService {

    private static prismaClient = prisma.getInstance();

    public static saveUser = async (organisationId: string,user: RegisterDTO) => {
        const savedUser = await this.prismaClient.user.create({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                organisationId: organisationId,
                role: (user.isAdmin) ? Role.ADMIN : Role.USER
            }
        });
        return savedUser;
    }

    public static findorganisationFromUserId = async (id: string) => {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id: id
            }
        });
        if (!user) throw createHttpError(404, "User not found");
        return user.organisationId;
    }

    public static findUserById = async (id: string) => {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id: id
            }
        });
        if (!user) throw createHttpError(404, "User not found");
        return user;
    }

    public static findAllUsersOfOrganization = async (organizationId: string) => {
        const allUsers = await this.prismaClient.user.findMany({
            where: {
                organisationId: organizationId
            }
        });
        if (!allUsers) throw createHttpError(404, "Users not found");
        return allUsers;
    }

    public static findUserByEmail = async (email: string) => {
        const user = await this.prismaClient.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) throw createHttpError(404, "User not found");
        return user;
    }


    public static updateUser = async (id: string, user: UpdateUserDTO) => {
        const updatedUser = await this.prismaClient.user.update({
            where: {
                id: id
            },
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password
            }
        });
        return updatedUser;
    }

    public static deleteUserById = async (id: string) => {
        const deletedUser = await this.prismaClient.user.delete({
            where: {
                id: id
            }
        });
        return deletedUser;
    }


    public static alreadyExists = async (user: RegisterDTO) => {
        const existingUser = await this.prismaClient.user.findUnique({
            where: {
                email: user.email
            }
        });
        return existingUser ? true : false;
    }

    public static addIntegration = async (userId: string, integrationId: string) => {
        const updatedUser = await this.prismaClient.user.update({
            where: {
                id: userId
            },
            data: {
                organisationId: "TODO"
            }
        });
        return updatedUser;
    }

    public static removeIntegration = async (userId: string, integrationId: string) => {
        const updatedUser = await this.prismaClient.user.update({
            where: {
                id: userId
            },
            data: {
                organisationId: "TODO"
            }
        });
        return updatedUser;
    }

    public static getAllUserIntegrations = async (userId: string) => {
        const user = await this.prismaClient.organisation.findUnique({
            where: {
                id: "TODO"
            },
            include: {
                integrations: true
            }
        });
        if (!user) throw createHttpError(404, "User not found");
        return user.integrations;
    }

    public static getUserIntegrationById = async (userId: string, integrationId: string) => {
        const user = await this.prismaClient.organisation.findUnique({
            where: {
                id: "TODO"
            },
            include: {
                integrations: {
                    where: {
                        id: integrationId
                    }
                }
            }
        });
        if (!user) throw createHttpError(404, "User not found");
        return user.integrations[0];


        // this.prismaClient.integration.findMany({
        //     where: {
        //         user: {
        //             id: user.id

        //         }
        //     }
        // })

    }
}
