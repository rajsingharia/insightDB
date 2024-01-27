import { JsonValue } from "@prisma/client/runtime/library";
import { connectDataSourceService } from "./connectDataSource.service";
import createHttpError from "http-errors";
import pg from "pg";
import mongoose from "mongoose";
import { Axios } from "axios";
import { RestApiParametersDTO } from "../dto/request/parameters/RestApi.parameters.dto";
import { DataBaseType } from "../util/constants";

type Connection = pg.PoolClient | mongoose.Mongoose | Axios | undefined;

interface IGetAllData {
    fields?: string[];
    data: unknown[];
    timeField?: string;
    countOfFields: number
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
        if (!pool) throw createHttpError(500, "Internal Server Error");
        console.log(typeof pool);

        if (type === DataBaseType.POSTGRES_QL.valueOf()) {
            const response = await this.getAllDataPostgres(pool as pg.PoolClient, rawQuery);
            return response;
        }
        else if (type === DataBaseType.MONGO_DB.valueOf()) {
            const response = await this.getAllDataMongoDB(pool as mongoose.Mongoose, rawQuery);
            return response;
        }
        // else if (type === DataBaseType.REST_API.valueOf()) {
        //     const response = await this.getAllDataRestApi(pool as Axios, parameters as RestApiParametersDTO);
        //     return response;
        // }
        // add other types here

    }



    private static async getAllDataPostgres(pool: pg.PoolClient, query: string): Promise<IGetAllData> {

        //const query = QueryBilderService.buildPostgresQuery(parameters);

        try {
            const response = await pool.query(query);
            console.log(response)
            const fields = Object.keys(response.rows[0])

            return {
                fields: fields,
                data: response.rows,
                countOfFields: fields.length
            }
        } catch (error) {
            console.log(`Postgres Error: ${error}`);
            throw createHttpError(500, "Internal Server Error");
        }

    }


    private static async getAllDataMongoDB(mongoose: mongoose.Mongoose, query: string): Promise<IGetAllData> {
        //const mongoParams = parameters as MongoDBParametersDTO;
        //const collectionName = mongoParams.sourceName!;
        const splitted = query.split(':')
        const collectionConnection = mongoose.connection.db.collection(splitted[0]);
        //const query = QueryBilderService.buildMongoDBQuery(mongoParams);

        try {
            const response = await collectionConnection.aggregate(eval(`(${splitted[1]})`)).toArray();
            return {
                fields: undefined,
                data: response,
                countOfFields: 0
            }
        } catch (error) {
            console.log(`Mongodb Error: ${error}`);
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
                countOfFields: 0
            }

        } catch (error) {
            throw createHttpError(500, "Internal Server error");
        }

    }
}
