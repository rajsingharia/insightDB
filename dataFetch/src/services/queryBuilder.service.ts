/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoDBParametersDTO } from "../dto/request/parameters/Mongodb.parameters.dto";
import { PostgresParametersDTO } from "../dto/request/parameters/Postgres.parameters.dto";


export class QueryBuilderService {

    public static buildPostgresQuery = (postgresParams: PostgresParametersDTO): string => {


        const limit = (postgresParams?.limit && postgresParams?.limit !== "") ? parseInt(postgresParams.limit) : 0;
        const columns = (postgresParams?.columns && postgresParams?.columns.length > 0) ? postgresParams.columns : undefined;
        const timeField = (postgresParams?.timeField && postgresParams?.timeField !== "") ? postgresParams.timeField : undefined;
        const filters = (postgresParams?.filters && postgresParams?.filters.length > 0) ? postgresParams.filters : undefined;
        const orderBy = (postgresParams?.orderBy && postgresParams?.orderBy.length > 0) ? postgresParams.orderBy : undefined;
        const aggregationType = postgresParams.aggregationType;
        const timeRange = postgresParams.timeRange;
        const sourceName = postgresParams.sourceName;


        let query: string = "";

        if (aggregationType && aggregationType !== "") {
            // Aggregation query
            query += (`SELECT `);
            columns?.forEach((column, index) => {
                query += (`${aggregationType.toUpperCase()}(${column}) as ${aggregationType}_${column}`);
                if (index !== columns.length - 1) query += (", ");
                else query += (" ");
                columns[index] = `${aggregationType}_${column}`;
            });
        } else {
            // Select query
            if (columns) {
                query += (`SELECT ${columns?.join(", ")} `);
            }
            if(timeField) {
                query += (`,${timeField} `);
            }
            else {
                query += (`SELECT * `);
            }
        }

        // From query
        query += (`FROM ${sourceName} `);


        // Where query
        if (filters && filters.length > 0) {
            query += (`WHERE ${filters?.join(" AND ")} `);
        }


        // Order by query
        if (orderBy && orderBy.length > 0) {
            query += (`ORDER BY ${orderBy?.join(", ")} `);
        }


        // Limit query
        if (limit && limit != 0) {
            query += (`LIMIT ${limit} `);
        }


        // Time range query
        if (timeRange && timeRange.from && timeRange.to) {
            query += (`TIME RANGE ${timeRange.from} TO ${timeRange.to};`);
        }

        console.log(`Postgres Query Performed: ${query}`);

        return query;
    }

    public static buildMongoDBQuery = (mongoParams: MongoDBParametersDTO): any => {

        const limit = (mongoParams?.limit && mongoParams?.limit !== "") ? parseInt(mongoParams.limit) : 0;
        const columns = (mongoParams?.columns && mongoParams?.columns.length > 0) ? mongoParams.columns : undefined;
        const timeField = (mongoParams?.timeField && mongoParams?.timeField !== "") ? mongoParams.timeField : undefined;
        const filters = (mongoParams?.filters && mongoParams?.filters.length > 0) ? mongoParams.filters : undefined;
        const orderBy = (mongoParams?.orderBy && mongoParams?.orderBy.length > 0) ? mongoParams.orderBy : undefined;
        const shouldIncludeId = columns && columns.includes("_id");
        const aggregationType = mongoParams.aggregationType;

        const mongoDbOperators = ["=", ">", "<", ">=", "<=", "!="];

        const query: any[] = [];

        // Matching stage based on filters
        if (filters) {
            const matchStage: any = {};
            for (const filter of filters) {
                const [value1, operator, value2] = filter.split(mongoDbOperators.find(op => filter.includes(op))!);
                const mongoDbOperator = operator === "=" ? "eq" : operator === ">" ? "gt" : operator === "<" ? "lt" : operator === ">=" ? "gte" : operator === "<=" ? "lte" : operator === "!=" ? "ne" : operator;
                matchStage[value1] = { [`$${mongoDbOperator}`]: value2 };
            }
            query.push({ $match: matchStage });
        }

        // Grouping stage for averaging columns and Projecting stage for selecting columns

        if (columns) {
            if (aggregationType && aggregationType !== "") {
                const groupStage: any = { _id: null };
                for (const column of columns) {
                    groupStage[`${aggregationType}_${column}`] = { [`$${aggregationType}`]: `$${column}` };
                    columns[columns.indexOf(column)] = `${aggregationType}_${column}`;
                }
                query.push({ $group: groupStage });
            }
            else {
                const projection: any = { _id: shouldIncludeId ? 1 : 0 };
                for (const column of columns) {
                    if (column !== "_id" || shouldIncludeId)
                        projection[column] = 1;
                }
                if(timeField) projection[timeField!] = 1;
                query.push({ $project: projection });
            }
        }

        // Optionally, add a sorting stage
        if (orderBy) {
            const sortStage: any = {};
            for (const order of orderBy) {
                sortStage[order] = 1;
            }
            query.push({ $sort: sortStage });
        }

        // Optionally, add a limit stage
        if (limit > 0) {
            query.push({ $limit: limit });
        }

        console.log(`MongoDB Query Performed: ${JSON.stringify(query)}`);

        return query;

    }

}