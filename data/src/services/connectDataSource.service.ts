import { JsonValue } from "@prisma/client/runtime/library";
import pg, { Pool } from "pg";
import mongoose, { ConnectOptions } from "mongoose";
import { Axios } from "axios";
import { DataBaseType } from "insightdb-common"
import createHttpError from "http-errors";
import { DataSourceConfig } from "../config/dataSource.config";
import { Redis } from "ioredis";
import * as mysql from "mysql2/promise"

type Connection = pg.PoolClient | mongoose.Mongoose | Axios | Redis | mysql.Connection | undefined;

export class connectDataSourceService {

    private static allConnections: Map<JsonValue, Connection> = new Map<JsonValue, Connection>();
    private static postgresConnectionPoolMap: Map<string, Pool> = new Map<string, Pool>();

    public static connectDataSource = async (type: string, credentials: JsonValue): Promise<Connection | undefined> => {

        const connectionKey = JSON.stringify(credentials);

        if (this.allConnections.has(connectionKey)) return this.allConnections.get(connectionKey);

        if (type === DataBaseType.POSTGRES_QL.valueOf()) {
            const client = await this.connectPostgres(credentials);
            if(!client) throw createHttpError("Postgres Client is not defined");
            this.allConnections.set(connectionKey, client);
            return this.allConnections.get(connectionKey);
        }
        else if (type === DataBaseType.MONGO_DB.valueOf()) {
            const getMongoDBConfig = await DataSourceConfig.getMongoDBConfig(credentials);

            console.log("mongoDb getMongoDBConfig :: " + getMongoDBConfig)
            console.log("mongoDb credentials :: " + credentials)

            try {
                const mongoConnection = await mongoose.connect(
                    getMongoDBConfig,
                    { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions
                );
                this.allConnections.set(credentials, mongoConnection);
                return this.allConnections.get(credentials);
            } catch (error) {
                console.log("Error while connecting to mongoDB : " + error)
                throw createHttpError("Error while connecting to mongoDB : " + error)
            }
        }
        else if (type === DataBaseType.MY_SQL.valueOf()) {

            const getMySQLConfig = await DataSourceConfig.getMySQLConfig(credentials);

            const connection = await mysql.createConnection(getMySQLConfig);
            await connection.connect()
            if (credentials == null) {
                throw createHttpError(500, 'No credentials provided');
            }

            this.allConnections.set(credentials, connection);
            return this.allConnections.get(credentials);
        }
        else if (type === DataBaseType.REDIS.valueOf()) {
            const redisConfig = await DataSourceConfig.getRedisConfig(credentials);
            try {
                const redisConnection = new Redis(redisConfig)
                this.allConnections.set(credentials, redisConnection);
                return this.allConnections.get(credentials);
            } catch (error) {
                console.log("Error while connecting to redis : " + error)
                throw createHttpError("Error while connecting to redis : " + error)
            }
        }
        else if (type === DataBaseType.REST_API.valueOf()) {
            const axiosConfig = await DataSourceConfig.getAxiosConfig(credentials);
            const axios = new Axios(axiosConfig);

            this.allConnections.set(credentials, axios);
            return this.allConnections.get(credentials);
        }
    }

    private static async connectPostgres(credentials: JsonValue): Promise<Connection> {
        const connectionKey = JSON.stringify(credentials);

        if (!this.postgresConnectionPoolMap.has(connectionKey)) {
            const postgresConfig = await DataSourceConfig.getPostgresConfig(credentials);
            const pool = new Pool(postgresConfig);
            this.postgresConnectionPoolMap.set(connectionKey, pool);
        }
        const pool = this.postgresConnectionPoolMap.get(connectionKey);
        if (!pool) {
            throw new Error('Failed to create PostgreSQL connection pool');
        }
        const client = await pool.connect();
        // Set expiration time for the connection in Redis (lets say 10 minutes)
        return client;
    }


}