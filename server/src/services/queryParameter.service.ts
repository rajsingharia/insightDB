import { DataBaseType } from "../util/constants";

type QueryInfo = {
    parameterName: string;
    parameterType: string;
    parameterCount?: number;
    parameterRequired: boolean;
    parameterDefault?: string;
    parameterHelperText?: string;
}

type QueryInfoResponse = {
    count: number;
    queryInfo: QueryInfo[];
}


export class QueryParameterService {
    public static getQueryInfo(dataBaseType: DataBaseType): unknown {
        if (dataBaseType == DataBaseType.MY_SQL || dataBaseType == DataBaseType.POSTGRES_QL || dataBaseType == DataBaseType.MONGO_DB) {
            const queryInfoResponse: QueryInfoResponse = {
                count: 4,
                queryInfo: [
                    {
                        parameterName: "sourceName",
                        parameterType: "string",
                        parameterRequired: true
                    },
                    {
                        parameterName: "columns",
                        parameterType: "string[]",
                        parameterRequired: false,
                        parameterHelperText: "Give the columns comma separated (don't include time field)"
                    },
                    {
                        parameterName: "timeField",
                        parameterType: "string",
                        parameterRequired: false,
                        parameterHelperText: "Give the time field"
                    },
                    {
                        parameterName: "orderBy",
                        parameterType: "string[]",
                        parameterRequired: false,
                        parameterHelperText: "Give the order by columns comma separated"
                    },
                    {
                        parameterName: "limit",
                        parameterType: "number",
                        parameterRequired: false
                    },
                    {
                        parameterName: "timeFrom",
                        parameterType: "string",
                        parameterRequired: false
                    },
                    {
                        parameterName: "aggregationType",
                        parameterType: "string",
                        parameterRequired: false,
                        parameterHelperText: "Give the aggregation type (sum, avg, count, min, max)"
                    },
                    // {
                    //     parameterName: "timeRange",
                    //     parameterType: "{from: string; to: string;}",
                    //     parameterRequired: false
                    // },
                    // {
                    //     parameterName: "filters",
                    //     parameterType: "[field: string; value: string; operator: string;]",
                    //     parameterRequired: false
                    // }
                ]
            }
            return queryInfoResponse;
        }
    }
}