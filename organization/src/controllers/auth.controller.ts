import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { PasswordHash } from "../security/passwordHash";
import { JWT } from "../security/jwt";
import { AuthenticationDTO } from "../dto/response/authentication.dto";
import { Converter } from "../util/converters";
import { RefreshTokenDto } from "../dto/request/refreshToken.dto";
import { RefreshTokenService } from "../services/refreshtoken.service";
import createHttpError from "http-errors";
import { RegisterDTO } from "../dto/request/register.dto";
import { validate } from "class-validator";
import { LoginDTO } from "../dto/request/login.dto";


interface IRegisterRequest extends Request {
    body: RegisterDTO | undefined;
}

interface ILoginRequest extends Request {
    body: LoginDTO | undefined;
}

interface IRefreshTokenRequest extends Request {
    body: RefreshTokenDto | undefined;
}


export class AuthController {

    public static register = async (req: IRegisterRequest, res: Response, next: NextFunction) => {
        try {
            
            const registerDto = req.body;

            if(!registerDto) throw createHttpError(400, "Body is required");

            const validationErrors = await validate(registerDto);
            if (validationErrors.length > 0) {
                throw createHttpError(400, `Validation error: ${validationErrors}`);
            }

            //check if user already exists
            const isAlreadyExists = await UserService.alreadyExists(registerDto);
            if (isAlreadyExists) {
                throw createHttpError(409, "User already exists");
            }

            //hash password
            const hashedPassword = await PasswordHash.hashPassword(registerDto.password);
            registerDto.password = hashedPassword;

            //save user to db
            const user = await UserService.saveUser(registerDto.organizationId, registerDto);

            if(!user) throw createHttpError.NotFound("User Not found")
            
            const response = Converter.UserEntityToUserDto(registerDto.organizationId, user);

            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }

    public static login = async (req: ILoginRequest, res: Response, next: NextFunction) => {
        try {
            const loginDto = req.body;

            if (!loginDto) throw createHttpError(400, "Body is required");

            const validationErrors = await validate(loginDto);
            if (validationErrors.length > 0) {
                throw createHttpError(400, `Validation error: ${validationErrors}`);
            }

            //check if user exists
            const user = await UserService.findUserByEmail(loginDto.email);

            if(!user) throw createHttpError.NotFound("User Not found")

            //compare password
            await PasswordHash.comparePassword(user.password, loginDto.password);

            //generate token
            const { token, refreshToken } = await JWT.generateToken(user);

            if(!user.organisationId) throw createHttpError.NotFound("Organisation not assigned to the user")


            //send response
            const userResponse = Converter.UserEntityToUserDto(user.organisationId, user);
            const response: AuthenticationDTO = {
                token: token,
                refreshToken: refreshToken,
                user: userResponse
            }

            res.cookie('token', token, { httpOnly: true, domain: 'localhost', path: '/' });
 
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }

    public static refreshToken = async (req: IRefreshTokenRequest, res: Response, next: NextFunction) => {
        try {
            const body = req.body;

            //data validation
            if (!body) throw createHttpError(400, "Body is required");


            //check if jwt token is valid
            const isTokenValid = await JWT.validateToken(body.token);
            if (!isTokenValid) throw new Error("Invalid token");

            const jwtid = await JWT.getJwtIdFromToken(body.token);

            // check if the refresh token exists and is linked to the jwt token
            const isRefreshTokenExistsAndHasJwtId = await RefreshTokenService.isRefreshTokenExistsAndHasJwtId(body.refreshToken, jwtid);
            if (!isRefreshTokenExistsAndHasJwtId) throw new Error("Invalid refresh token");

            // check if the jwt token is expired
            const isTokenExpired = JWT.isTokenExpired(body.token);
            if (isTokenExpired) throw new Error("Token expired");

            // check if the refresh token is expired or used or invalidated
            const isRefreshTokenExpired = await RefreshTokenService.isRefreshTokenExpiredOrUsedOrInvalidated(body.refreshToken);
            if (isRefreshTokenExpired) throw new Error("Refresh token expired");
            // mark the refresh token as used

            await RefreshTokenService.markRefreshTokenAsUsed(body.refreshToken);

            // find the user in the database
            const userId = await JWT.getUserIdFromToken(body.token);
            const user = await UserService.findUserById(userId);

            if(!user) throw createHttpError.NotFound("User Not found")

            // generate a fresh pair of tokens( jwt token and refresh token )
            const { token, refreshToken } = await JWT.generateToken(user);

            if(!user.organisationId) throw createHttpError.NotFound("Organisation not assigned to the user")

            //send response
            const userResponse = Converter.UserEntityToUserDto(user.organisationId, user);
            const response: AuthenticationDTO = {
                token: token,
                refreshToken: refreshToken,
                user: userResponse
            }

            // send response
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }


}
