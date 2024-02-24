import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UpdateUserDTO } from "../dto/request/updateUser.dto";
import { PasswordHash } from "../security/passwordHash";
import { Converter } from "../util/converters";
import { UserDTO } from "../dto/response/user.dto";
import createHttpError from "http-errors";
import { validate } from "class-validator";
import { organisationService } from "../services/org.service";


interface UpdateUserRequest extends Request {
    body: UpdateUserDTO;
}


export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //console.log(req.body);
        const userId = req.body.userId;
        const organisationId = req.body.organisationId;
        if (!userId) throw createHttpError(401, "organisation id required");

        const user = await UserService.findUserById(userId);

        if (!user) throw createHttpError(404, "User not found");
        
        const organisation = await organisationService.findorganisationById(organisationId)

        if(!organisation) throw createHttpError.NotFound("Organisation not assigned to the user")

        const response: UserDTO = Converter.UserEntityToUserDto(organisation.name, user);
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const updateUserDto = req.body;

        const validationErrors = await validate(updateUserDto);
        if (validationErrors.length > 0) {
            throw createHttpError(400, `Validation error: ${validationErrors}`);
        }



        if (updateUserDto.password) {
            updateUserDto.password = await PasswordHash.hashPassword(updateUserDto.password);
        }

        const user = await UserService.updateUser(id, updateUserDto);

        if(!user) throw createHttpError.NotFound("User Not found")
        if (!user.organisationId) throw createHttpError.NotFound("Organisation not assigned to the user")

        const organisation = await organisationService.findorganisationById(user.organisationId)

        const response: UserDTO = Converter.UserEntityToUserDto(organisation.name, user);
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const user = await UserService.deleteUserById(id);

        if(!user) throw createHttpError.NotFound("User Not found")
        if (!user.organisationId) throw createHttpError.NotFound("Organisation not assigned to the user")

        const organisation = await organisationService.findorganisationById(user.organisationId)

        const response: UserDTO = Converter.UserEntityToUserDto(organisation.name, user);
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
}