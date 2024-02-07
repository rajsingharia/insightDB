import prisma from "../config/database.config";
import { IRefreshToken } from "../interfaces/IRefreshToken";


export class RefreshTokenService {

    private static prismaClient = prisma.getInstance();

    public static async saveRefreshTokenForUserAndToken(refreshToken: IRefreshToken): Promise<string> {
        // create a new record in the database for the above refresh token
        const createdRefreshToken = await this.prismaClient.refreshToken.create({
            data: {
                userId: refreshToken.userId,
                jwtid: refreshToken.jwtid,
                expiresAt: refreshToken.expiresAt
            }
        });
        // return the refresh token ID
        return createdRefreshToken.id;

    }
    public static async isRefreshTokenExistsAndHasJwtId(refreshTokenID: string, jwtId: string): Promise<boolean> {
        // find the refresh token in the database
        const refreshToken = await this.prismaClient.refreshToken.findFirst({
            where: {
                id: refreshTokenID,
            }
        });

        if (!refreshToken) return false;

        // check if the jwtid matches the one in the database
        if (refreshToken.jwtid !== jwtId) return false;
        return true;
    }

    public static async isRefreshTokenExpiredOrUsedOrInvalidated(refreshTokenID: string): Promise<boolean> {
        // find the refresh token in the database
        const refreshToken = await this.prismaClient.refreshToken.findFirst({
            where: {
                id: refreshTokenID,
            }
        });

        // check if the refresh token is expired or used or invalidated
        if (!refreshToken || refreshToken.invalidated || refreshToken.used) return true;
        const expirationDate = refreshToken.expiresAt;
        return expirationDate < new Date();
    }

    public static async markRefreshTokenAsUsed(refreshTokenID: string): Promise<void> {
        // mark the refresh token as used
        await this.prismaClient.refreshToken.update({
            where: {
                id: refreshTokenID
            },
            data: {
                used: true
            }
        });
    }
}