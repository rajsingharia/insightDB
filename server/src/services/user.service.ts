import { Integration, User } from "@prisma/client";
import { RegisterDTO } from "../dto/request/register.dto";
import prisma from "../config/database.config";
import createHttpError from "http-errors";
import { UpdateUserDTO } from "../dto/request/updateUser.dto";


export class UserService {

    private static prismaClient = prisma.getInstance();

    public static saveUser = async (user: RegisterDTO): Promise<User> => {
        const savedUser = await this.prismaClient.user.create({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password
            }
        });
        return savedUser;
    }

    public static findUserById = async (id: string): Promise<User> => {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id: id
            }
        });
        if (!user) throw createHttpError(404, "User not found");
        return user;
    }

    public static findUserByEmail = async (email: string): Promise<User> => {
        const user = await this.prismaClient.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) throw createHttpError(404, "User not found");
        return user;
    }


    public static updateUser = async (id: string, user: UpdateUserDTO): Promise<User> => {
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

    public static deleteUserById = async (id: string): Promise<User> => {
        const deletedUser = await this.prismaClient.user.delete({
            where: {
                id: id
            }
        });
        return deletedUser;
    }


    public static alreadyExists = async (user: RegisterDTO): Promise<boolean> => {
        const existingUser = await this.prismaClient.user.findUnique({
            where: {
                email: user.email
            }
        });
        return existingUser ? true : false;
    }

    public static addIntegration = async (userId: string, integrationId: string): Promise<User> => {
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

    public static removeIntegration = async (userId: string, integrationId: string): Promise<User> => {
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

    public static getAllUserIntegrations = async (userId: string): Promise<Integration[]> => {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id: userId
            },
            include: {
                integrations: true
            }
        });
        if (!user) throw createHttpError(404, "User not found");
        return user.integrations;
    }

    public static getUserIntegrationById = async (userId: string, integrationId: string): Promise<Integration> => {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id: userId
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
