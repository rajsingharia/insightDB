import jsonwebtoken from "jsonwebtoken";
import moment from "moment";
import createHttpError from "http-errors";


export class JWT {


    public static async validateToken(token: string): Promise<boolean> {
        try{
            const decoded = await this.decodeToken(token);
            if(!decoded) return false;
            return true;
        } catch(error){
            return false;
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

    public static async getOrganizationIdFromToken(token: string): Promise<string> {
        try {
            const decoded = await this.decodeToken(token) as jsonwebtoken.JwtPayload;
            return decoded["organizationId"] as string;
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

}