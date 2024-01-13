import { JsonValue } from "@prisma/client/runtime/library";
import pg, { Pool } from "pg";
import { DatasourceConfig } from "../config/datasource.config";
import mongoose, { ConnectOptions } from "mongoose";
import { Axios } from "axios";
import { DataBaseType } from "../util/constants";

type Connection = pg.PoolClient | mongoose.Mongoose | Axios | undefined;

export class connectDataSourceService {

    private static allConnections: Map<JsonValue, Connection> = new Map<JsonValue, Connection>();


    //TODO: should not be a singleton
    //TODO: should be able to connect to multiple datasources
    //TODO: find a caching solution for the connections


    public static connectDataSource = async (type: string, credentials: JsonValue): Promise<Connection | undefined> => {


        if (this.allConnections.has(credentials)) return this.allConnections.get(credentials);

        if (type === DataBaseType.POSTGRES_QL.valueOf()) {
            const getPostgresConfig = await DatasourceConfig.getPostgresConfig(credentials);
            const pool = new Pool(getPostgresConfig);
            const connection = await pool.connect();
            this.allConnections.set(credentials, connection);
            return this.allConnections.get(credentials);
        }
        else if (type === DataBaseType.MONGO_DB.valueOf()) {
            const getMongoDBConfig = await DatasourceConfig.getMongoDBConfig(credentials);
            const mongoConnection = await mongoose.connect(
                getMongoDBConfig,
                { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions
            );
            this.allConnections.set(credentials, mongoConnection);
            return this.allConnections.get(credentials);
        } 
        else if (type === DataBaseType.REST_API.valueOf()) {
            const axiosConfig = await DatasourceConfig.getAxiosConfig(credentials);
            const axios = new Axios(axiosConfig);

            this.allConnections.set(credentials, axios);
            return this.allConnections.get(credentials);
        }
    }
}