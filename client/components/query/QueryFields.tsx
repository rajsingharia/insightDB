import React, { ReactNode } from 'react'
import CustomAxios from "@/utils/CustomAxios"
import { ICharts } from "@/interfaces/ICharts"
import { FetchDataResponse } from '@/app/(root)/addInsight/page';
import { SQLQueryInput } from '@/components/query/SQLQueryInput';
import { MongoQueryInput } from '@/components/query/MongoQueryInput';
import { DataBaseType } from 'insightdb-common'


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



interface QueryFieldsProps {
    integrationId: string;
    integrationType: string;
    setInsightData: React.Dispatch<React.SetStateAction<FetchDataResponse | undefined>>;
    // setSelectedChartColors: React.Dispatch<React.SetStateAction<ChartColors | undefined>>;
    chartType: ICharts;
    rawQuery: string;
    setRawQuery: React.Dispatch<React.SetStateAction<string>>;
}


export const QueryFields: React.FC<QueryFieldsProps> = ({
    integrationId,
    integrationType,
    setInsightData,
    rawQuery,
    setRawQuery }) => {

    const fetchDataAxios = CustomAxios.getFetchDataAxios();

    const getInsightData = () => {

        async function getData() {
            const response = await fetchDataAxios.get(`/integrations/${integrationId}`)
            if (response.status !== 200 || !response.data) {
                console.log(response.statusText);
                //setError(response.statusText);
            }
            const integration = response.data

            const body = {
                integrationId: integrationId,
                rawQuery: rawQuery
            }

            fetchDataAxios.post('/fetchData/query', body)
                .then((res) => {
                    console.log("Data: ", res.data);
                    setInsightData(res.data);
                })
                .catch((err) => {
                    console.log(err);
                    //setError(err.message);
                });

        }

        getData()

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
