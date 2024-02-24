import { JsonValue } from "@prisma/client/runtime/library";
import { AxiosRequestConfig } from "axios";
import { RedisOptions } from "ioredis";

export class DataSourceConfig {
    public static getPostgresConfig = async (credentials: JsonValue) => {

        credentials = credentials as { username: string; host: string; database: string; password: string; port: number; ca?: string };

        const caBuffer = credentials.ca ? Buffer.from(credentials.ca as string) : undefined;

        const pool = {
            user: credentials.username?.toLocaleString(),
            host: credentials.host?.toLocaleString(),
            database: credentials.database?.toLocaleString(),
            password: credentials.password?.toLocaleString(),
            port: credentials.port as number,
            ssl: {
                rejectUnauthorized: false,
                ca: caBuffer,
            }
        };
        return pool;
    }
    public static getMongoDBConfig = async (credentials: JsonValue) => {
        credentials = credentials as { username: string; password: string; host: string; };
        const uri = `mongodb+srv://${credentials.username}:${credentials.password}@${credentials.host}?retryWrites=true&w=majority`;
        return uri;
    }

    public static getRedisConfig = async (credentials: JsonValue) => {
        credentials = credentials as { host: string; port: string; user: string; password: string; };
        const redisConfig = {
            host: credentials.host,
            port: credentials.port,
            username: credentials.user,
            password: credentials.password,
        } as RedisOptions
        return redisConfig;
    }

    public static getMySQLConfig = async (credentials: JsonValue) => {

        credentials = credentials as { username: string; host: string; database: string; password: string; port: number; ca?: string };

        const caBuffer = credentials.ca ? Buffer.from(credentials.ca as string) : undefined;

        const connectionParams  = {
            host: credentials.host?.toLocaleString(),
            user: credentials.username?.toLocaleString(),
            database: credentials.database?.toLocaleString(),
            password: credentials.password?.toLocaleString(),
            port: credentials.port as number,
            ca: caBuffer,
        };
        return connectionParams ;
    }

    public static getAxiosConfig = async (credentials: JsonValue) => {
        credentials = credentials as { baseUrl: string };
        const axiosConfig: AxiosRequestConfig = {
            baseURL: credentials.baseUrl?.toLocaleString(),
        }
        return axiosConfig
    }
}