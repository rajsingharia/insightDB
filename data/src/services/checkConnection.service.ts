import { DataBaseType } from "../util/constants";
import { DataSourceConfig } from "../config/dataSource.config";
import { Pool } from "pg";
import createHttpError from "http-errors";
import mongoose, { ConnectOptions } from "mongoose";
import { Axios } from "axios";
import { JsonValue } from "@prisma/client/runtime/library";
import { Redis } from "ioredis";

export class CheckConnectionService {

    public static checkConnection = async (type: string, credentials: JsonValue) => {

        console.log(type)

        if (type === DataBaseType.POSTGRES_QL.valueOf()) {

            const getPostgresConfig = await DataSourceConfig.getPostgresConfig(credentials);
            const pool = new Pool(getPostgresConfig);
            await pool.connect();

        }
        else if (type === DataBaseType.MONGO_DB.valueOf()) {
            const getMongoDBConfig = await DataSourceConfig.getMongoDBConfig(credentials);

            console.log("mongoDb getMongoDBConfig :: " + getMongoDBConfig)
            console.log("mongoDb credentials :: " + credentials)

            try {
                await mongoose.connect(
                    getMongoDBConfig,
                    { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions
                );
            } catch (error) {
                console.log("Error while connecting to mongoDB : " + error)
                throw createHttpError("Error while connecting to mongoDB : " + error)
            }
        }
        else if (type === DataBaseType.REDIS.valueOf()) {
            const redisConfig = await DataSourceConfig.getRedisConfig(credentials);
            try {
                const redisClient = new Redis(redisConfig)
                await redisClient.ping();
            } catch (error) {
                console.log("Error while connecting to redis : " + error)
                throw createHttpError("Error while connecting to redis : " + error)
            }
        }
        else if (type === DataBaseType.REST_API.valueOf()) {
            const axiosConfig = await DataSourceConfig.getAxiosConfig(credentials);
            const axios = new Axios(axiosConfig);
            console.log(axios)
        }
    }

}
