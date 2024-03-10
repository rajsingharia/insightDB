import { JsonValue } from "@prisma/client/runtime/library";
import { connectDataSourceService } from "./connectDataSource.service";
import createHttpError from "http-errors";
import pg from "pg";
import mongoose from "mongoose";
import { Axios } from "axios";
import { RestApiParametersDTO } from "../dto/request/parameters/RestApi.parameters.dto";
import { DataBaseType } from "insightdb-common"
import { Redis } from "ioredis";
import * as mysql from "mysql2/promise"

export type Connection = pg.PoolClient | mongoose.Mongoose | Axios | Redis | mysql.Connection | undefined;

interface IGetAllData {
    fields?: string[];
    data: unknown[];
}

export class fetchDataService {

    // public static getAllData = async (type: string, credentials: JsonValue, parameters: IParameters): Promise<IGetAllData | undefined> => {

    //     const pool: Connection = await connectDataSourceService.connectDataSource(type, credentials);
    //     if (!pool) throw createHttpError(500, "Internal Server Error");
    //     console.log(typeof pool);

    //     if (type === DataBaseType.POSTGRES_QL.valueOf()) {
    //         const response = await this.getAllDataPostgres(pool as pg.PoolClient, parameters as PostgresParametersDTO);
    //         return response;
    //     }
    //     else if (type === DataBaseType.MONGO_DB.valueOf()) {
    //         const response = await this.getAllDataMongoDB(pool as mongoose.Mongoose, parameters as MongoDBParametersDTO);
    //         return response;
    //     }
    //     else if (type === DataBaseType.REST_API.valueOf()) {
    //         const response = await this.getAllDataRestApi(pool as Axios, parameters as RestApiParametersDTO);
    //         return response;
    //     }
    //     // add other types here

    //     return undefined

    // }

    public static getAllDataFromRawQuery = async (type: string, credentials: JsonValue, rawQuery: string): Promise<IGetAllData | undefined> => {

        const pool: Connection = await connectDataSourceService.connectDataSource(type, credentials);
        if (!pool) throw createHttpError(500, "Internal Server Error pool empty");

        if (type === DataBaseType.POSTGRES_QL.valueOf()) {
            const response = await this.getAllDataPostgres(pool as pg.PoolClient, rawQuery);
            return response;
        }
        else if (type === DataBaseType.MONGO_DB.valueOf()) {
            const response = await this.getAllDataMongoDB(pool as mongoose.Mongoose, rawQuery);
            return response;
        }
        if (type === DataBaseType.MY_SQL.valueOf()) {
            const response = await this.getAllDataMySQL(pool as mysql.Connection, rawQuery);
            return response;
        }
        else if (type === DataBaseType.REDIS.valueOf()) {
            const response = await this.getAllDataRedis(pool as Redis, rawQuery);
            return response;
        }
        // else if (type === DataBaseType.REST_API.valueOf()) {
        //     const response = await this.getAllDataRestApi(pool as Axios, parameters as RestApiParametersDTO);
        //     return response;
        // }
        // add other types here

    }


    public static getAllInfo = async (type: string, credentials: JsonValue): Promise<unknown[] | undefined> => {

        const pool: Connection = await connectDataSourceService.connectDataSource(type, credentials);
        if (!pool) throw createHttpError(500, "Internal Server Error pool empty");

        if (type === DataBaseType.POSTGRES_QL.valueOf()) {
            const rawQueryForInfo = `SELECT table_schema, table_name, column_name FROM information_schema.columns WHERE table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast') ORDER BY table_name, ordinal_position;`
            const response = await this.getAllDataFromRawQuery(type, credentials, rawQueryForInfo)
            const tableColumnStrings = (response?.data as { table_schema: string, table_name: string, column_name: string }[]).map(row => `${row.table_name} : ${row.column_name}`);
            return tableColumnStrings
        }
        else if (type === DataBaseType.MONGO_DB.valueOf()) {
            const mongoose = (pool as mongoose.Mongoose)
            try {
                const collections = await mongoose.connection.db.listCollections().toArray();
                const tableColumnStrings: string[] = []
                for (const collection of collections) {
                    const collectionName = collection.name;
                    const keys = await mongoose.connection.db.collection(collectionName).findOne();
                    for (const key in keys) {
                        tableColumnStrings.push(`${collectionName} : ${key}`);
                    }
                }

                mongoose.connection.close();
                return tableColumnStrings
            } catch (error) {
                console.error('Error:', error);
            }
        }
        if (type === DataBaseType.MY_SQL.valueOf()) {
            const rawQueryForInfo = "SELECT table_name, column_name FROM information_schema.columns WHERE table_schema NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys') ORDER BY table_name, ordinal_position;"
            const response = await this.getAllDataFromRawQuery(type, credentials, rawQueryForInfo)
            const tableColumnStrings = (response?.data as { TABLE_NAME: string, COLUMN_NAME: string }[]).map(row => `${row.TABLE_NAME} : ${row.COLUMN_NAME}`);
            return tableColumnStrings
        }
        else if (type === DataBaseType.REDIS.valueOf()) {
            return []
        }

    }


    private static async getAllDataPostgres(pool: pg.PoolClient, query: string): Promise<IGetAllData> {

        //const query = QueryBuilderService.buildPostgresQuery(parameters);

        try {
            const response = await pool.query(query);
            //console.log(response)
            const fields = Object.keys(response.rows[0])

            return {
                fields: fields,
                data: response.rows
            }
        } catch (error) {
            console.log(`Postgres Error: ${error}`);
            throw createHttpError(500, "Internal Server Error");
        }

    }


    private static async getAllDataMongoDB(mongoose: mongoose.Mongoose, query: string): Promise<IGetAllData | undefined> {

        console.log("Mongo Raw Query :: ", query)
        const { collection, pipeline } = JSON.parse(query);

        const collectionConnection = mongoose.connection.db.collection(collection);

        try {
            const response = await collectionConnection
                .aggregate(pipeline)
                .toArray();

            console.log("Response :: ", response)

            const fields = Object.keys(response[0])
            return {
                fields: fields,
                data: response
            };
        } catch (error) {
            console.log(`Mongodb Error: ${error}`);
            throw createHttpError(500, "Internal Server Error");
        }

    }


    private static async getAllDataRedis(redisClient: Redis, query: string): Promise<IGetAllData> {
        try {
            const { dataType, key } = JSON.parse(query);

            if (dataType === 'STRING') {
                const redisString = await redisClient.get(key);
                const result: IGetAllData = {
                    fields: [key],
                    data: [
                        { [key]: redisString }
                    ],
                }
                console.log(result)
                return result;
            }
            if (dataType === 'LIST') {
                const hashObj = await redisClient.hgetall(key);
                const result: IGetAllData = {
                    fields: Object.keys(hashObj),
                    data: Object.values(hashObj).map((val) => { return JSON.parse(val) }),
                }
                return result;
            }
            if (dataType === 'HASH') {
                const hashObj = await redisClient.hgetall(key);
                const result: IGetAllData = {
                    fields: Object.keys(hashObj),
                    data: Object.values(hashObj).map((val) => { return JSON.parse(val) }),
                }
                return result;
            } else if (dataType === 'SET') {
                const arrSet = await redisClient.smembers(key);
                return {
                    fields: undefined,
                    data: arrSet
                };
            } else {
                throw new Error('Invalid Data Type');
            }

        } catch (error) {
            throw createHttpError(500, "Internal Server error" + error);
        }
    }

    private static async getAllDataMySQL(connection: mysql.Connection, query: string): Promise<IGetAllData> {

        //const query = QueryBuilderService.buildPostgresQuery(parameters);

        try {
            const [rows, fields] = await connection.query(query);
            const fieldNames = fields.map(field => field.name);
            const typedRows: mysql.RowDataPacket[] = rows as mysql.RowDataPacket[];

            return {
                fields: fieldNames,
                data: typedRows,
            };
        } catch (error) {
            console.log(`Postgres Error: ${error}`);
            throw createHttpError(500, "Internal Server Error");
        }

    }

    private static async getAllDataRestApi(pool: Axios, parameters: RestApiParametersDTO): Promise<IGetAllData> {

        try {
            const queryParams = parameters.queryParams?.join("&");
            if (queryParams) {
                parameters.endpoint = `${parameters.endpoint}?${queryParams}`;
            }

            const headers = parameters.headers;
            if (headers) {
                headers.forEach(header => {
                    const [key, value] = header.split(":");
                    pool.defaults.headers.common[key] = value;
                })
            }

            const response: unknown[] = await pool.get(parameters.endpoint!);
            const filteredResponse = response;

            // const fields = parameters.columns;
            // if(fields) {
            //     filteredResponse = response.map((item: unknown) => {
            //         const filteredItem = {};
            //         fields.forEach(field => {
            //             filteredItem[field] = item[field];
            //         })
            //         return filteredItem;
            //     })
            // }

            return {
                fields: parameters.columns!,
                data: filteredResponse,
            }

        } catch (error) {
            throw createHttpError(500, "Internal Server error");
        }

    }
}
