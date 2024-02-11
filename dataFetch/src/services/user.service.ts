import { RegisterDTO } from "../dto/request/register.dto";
import prisma from "../config/database.config";
import createHttpError from "http-errors";
import { UpdateUserDTO } from "../dto/request/updateUser.dto";
import { Role } from "@prisma/client";


export class UserService {

    private static prismaClient = prisma.getInstance();

    public static saveUser = async (organizationId: string,user: RegisterDTO) => {
        const savedUser = await this.prismaClient.user.create({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                organisationId: organizationId,
                role: (user.isAdmin) ? Role.ADMIN : Role.USER
            }
        });
        return savedUser;
    }

    public static findOrganizationFromUserId = async (id: string) => {
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
}
