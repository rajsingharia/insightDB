import { User } from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenService } from "../services/refreshtoken.service";
import { IRefreshToken } from "../interfaces/IRefreshToken";
import createHttpError from "http-errors";

type RefreshTokenAndToken = {
    token: string,
    refreshToken: string
}

export class JWT {

    public static async generateToken(user: User): Promise<RefreshTokenAndToken> {

        const payload = {
            id: user.id,
            organizationId: user.organisationId,
            email: user.email
        }

        const jwtid = uuidv4();

        const secret: string | undefined = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = jsonwebtoken.sign(
            payload,
            secret,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
                jwtid: jwtid, // used for refresh token generation and validation
                subject: user.id.toString(),
                issuer: process.env.JWT_ISSUER,
                algorithm: "HS256"
            }
        );

        // generate refresh token
        const refreshToken = await this.generateRefreshTokenForUserAndToken(user, jwtid);

        return {
            token: token,
            refreshToken: refreshToken
        }
    }

    public static async validateToken(token: string): Promise<boolean> {
        try{
            const decoded = await this.decodeToken(token);
            if(!decoded) return false;
            return true;
        } catch(error){
            return false;
        }
    }

    public static async getOrganizationIdFromToken(token: string): Promise<string> {
        try {
            const decoded = await this.decodeToken(token) as jsonwebtoken.JwtPayload;
            return decoded["organizationId"] as string;
        } catch (error) {
            throw createHttpError(401, "Invalid token");
        }
    }

    public static async getUserIdFromToken(token: string): Promise<string> {
        try {
            const decoded = await this.decodeToken(token) as jsonwebtoken.JwtPayload;
            return decoded["id"] as string;
        } catch (error) {
            throw createHttpError(401, "Invalid token");
        }
    }

    public static async getJwtIdFromToken(token: string): Promise<string> {
        try{
            const decoded = await this.decodeToken(token) as jsonwebtoken.JwtPayload;
            return decoded["jti"] as string;
        } catch(error){
            throw createHttpError(401, "Invalid token");
        }
    }

    public static isTokenExpired(token: string): boolean {
        const decodedToken = jsonwebtoken.decode(token) as jsonwebtoken.JwtPayload;
        const expirationDate = moment.unix(decodedToken["exp"] as number);
        return moment().isAfter(expirationDate);
    }

    private static async decodeToken(token: string): Promise<jsonwebtoken.JwtPayload> {
        const secret: string | undefined = process.env.JWT_SECRET;
        if (!secret) throw createHttpError(401, "JWT_SECRET is not defined");
        const decoded = jsonwebtoken.verify(token, secret, {
            ignoreExpiration: false,
            algorithms: ["HS256"],
            issuer: process.env.JWT_ISSUER
        });
        return decoded as jsonwebtoken.JwtPayload;
    }

    private static async generateRefreshTokenForUserAndToken(user: User, jwtId: string): Promise<string> {
        // create a new record in the database for the refresh token

        const refreshToken: IRefreshToken = {
            userId: user.id,
            jwtid: jwtId,
            expiresAt: moment().add(30, "days").toDate()
        }

        // set expiration date for the refresh token (30 days)
        const refreshTokenId = RefreshTokenService.saveRefreshTokenForUserAndToken(refreshToken);

        // return the refresh token
        return refreshTokenId;
    }
}