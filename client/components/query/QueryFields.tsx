import React, { ReactNode, useEffect, useState } from 'react'
import AuthAxios from '../../utils/AuthAxios';
import { ICharts } from '../../interfaces/ICharts';
import { FetchDataResponse } from '@/app/(root)/addInsight/page';
import { SQLQueryInput } from './SQLQueryInput';
import { MongoQueryInput } from './MongoQueryInput';


export type QueryInfo = {
    parameterName: string;
    parameterType: string;
    parameterRequired: boolean;
    parameterDefault?: string;
    parameterHelperText?: string;
}

type QueryInfoResponse = {
    count: number;
    queryInfo: QueryInfo[];
}

enum DataBaseType {
    POSTGRES_QL = 'POSTGRES_QL',
    MONGO_DB = 'MONGO_DB',
    MY_SQL = 'MY_SQL',
    ORACLE = 'ORACLE',
    CASSANDRA = 'CASSANDRA',
    DYNAMO_DB = 'DYNAMO_DB',
    REDIS = 'REDIS',
    KAFKA = 'KAFKA',
    REST_API = 'REST_API',
    RABBIT_MQ = 'RABBIT_MQ',
    ELASTIC_SEARCH = 'ELASTIC_SEARCH'
}


interface QueryFieldsProps {
    integrationId: string;
    integrationType: string;
    setInsightData: React.Dispatch<React.SetStateAction<FetchDataResponse | undefined>>;
    // setSelectedChartColors: React.Dispatch<React.SetStateAction<ChartColors | undefined>>;
    chartType: ICharts;
    rawQuery: string;
    setRawQuery: React.Dispatch<React.SetStateAction<string>>;
}

const getRawData = (event: React.FormEvent<HTMLFormElement>, queryInfo: QueryInfoResponse) => {
    event.preventDefault();

    const authAxios = AuthAxios.getAuthAxios();

    const parameters: any = {};

    queryInfo.queryInfo.forEach((queryInfo) => {

        const type = queryInfo.parameterType;
        const value = event.currentTarget[queryInfo.parameterName].value;

        if (value !== '') {
            if (type === 'string' || type === 'number') {
                parameters[queryInfo.parameterName as string] = value;
            } else if (type == 'string[]') {
                parameters[queryInfo.parameterName as string] = value.split(',').map((val: string) => val.trim());
            }
        }
    });

    console.log(queryInfo)
}



export const QueryFields: React.FC<QueryFieldsProps> = ({
    integrationId,
    integrationType,
    setInsightData,
    chartType,
    rawQuery,
    setRawQuery }) => {

    const getInsightData = () => {
        const authAxios = AuthAxios.getAuthAxios();

        const body = {
            integrationId: integrationId,
            rawQuery: rawQuery
        }

        authAxios.post('3001/api/v1/fetchData', body)
            .then((res) => {
                console.log("Data: ", res.data.data);
                const fetchedData = res.data as FetchDataResponse;
                setInsightData(fetchedData);
                setRawQuery(rawQuery);
            })
            .catch((err) => {
                console.log(err)
            });

        // TODO: This is a hacky way to refresh the data. Need to find a better way to do this.
        // TODO: Better way to do this is to use SSE (Server Sent Events) to push the data to the client.
        // const refreshRateInMs = refreshRate * 1000;
        // if (refreshRateInMs > 0) {
        //     setInterval(() => {
        //         fetchInsightData();
        //     }, refreshRateInMs);
        // }

    }

    const getQueryInputForIntegrationType = (): ReactNode => {
        if (integrationType === DataBaseType.POSTGRES_QL.valueOf()) {
            return (
                <SQLQueryInput
                    rawQuery={rawQuery}
                    setRawQuery={setRawQuery}
                    getInsightData={getInsightData} />
            )
        }

        else if (integrationType === DataBaseType.MONGO_DB.valueOf()) {
            return (
                <MongoQueryInput
                    setRawQuery={setRawQuery}
                    getInsightData={getInsightData} />
            )
        }

        return (
            <div>
                Query Input
            </div>
        )
    }


    return (
        <div className="flex flex-col h-full w-full">
            <div className="p-2 w-full h-full overflow-y-scroll">
                {
                    getQueryInputForIntegrationType()
                }
            </div>
        </div>
    )
}
