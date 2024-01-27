import React, { ReactNode, useEffect, useState } from 'react'
import AuthAxios from '../../utils/AuthAxios';
import { ICharts } from '../../interfaces/ICharts';
import { FetchDataResponse } from '@/app/(root)/addInsight/page';
import { SQLQueryInput } from './SQLQueryInput';


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
    // setSelectedChartColors,
    chartType,
    rawQuery,
    setRawQuery}) => {

    // const [refreshRate, setRefreshRate] = useState<number>(0);

    // useEffect(() => {
    //     const authAxios = AuthAxios.getAuthAxios();
    //     authAxios.get(`/charts/queries/${chartType.id}`)
    //         .then((res) => {
    //             console.log("Query Info: ", res.data);
    //             setQueryInfo(res.data);
    //             setInsightData(undefined);
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         });

    // }, [chartType, setInsightData]);

    const getInsightData = () => {
        //event.preventDefault();

        const authAxios = AuthAxios.getAuthAxios();

        const body = {
            integrationId: integrationId,
            rawQuery: rawQuery
        }

        authAxios.post('/fetchData', body)
            .then((res) => {
                console.log("Data: ", res.data.data);
                const fetchedData = res.data as FetchDataResponse;

                // const fieldsCount = fetchedData.countOfFields
                // if (fieldsCount) {
                //     const borderColors = getRandomNeonColor(Number(fieldsCount));
                //     let backgroundColors = borderColors;
                //     backgroundColors = backgroundColors.map((color) => color + '40');
                //     if (backgroundColors.length > 0 && borderColors.length > 0) {
                //         const chartColors = new ChartColors(
                //             backgroundColors,
                //             borderColors
                //         )
                //         console.log("Setting chart colors: ", chartColors);
                //         setSelectedChartColors(chartColors);
                //     }
                // }
                setInsightData(fetchedData);
                setRawQuery(rawQuery);
                // changeRefreshRate(refreshRate);
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
            return <SQLQueryInput
                rawQuery={rawQuery}
                setRawQuery={setRawQuery}
                getInsightData={getInsightData} />
        }
    }


    return (
        <div className="flex flex-col h-full w-full">
            {
                // <div className="flex flex-row justify-end items-center w-full gap-2">
                //     <div className="text-black font-mono text-sm">Refresh Rate (in seconds):</div>
                //     <Input
                //         type="number"
                //         className="bg-transparent text-black outline-none w-20 text-center h-full"
                //         value={refreshRate}
                //         onChange={(e) => setRefreshRate(parseInt(e.target.value))}
                //     />
                //     <div className="border-2 border-purple-500 rounded px-2 py-0 bg-purple-500 cursor-pointer bg-opacity-30"
                //         onClick={saveInsight}>
                //         <Save color="white" />
                //     </div>
                // </div>
            }
            <div className="p-2 w-full h-full overflow-y-scroll">
                {
                    getQueryInputForIntegrationType()
                }
            </div>
        </div>
    )
}
