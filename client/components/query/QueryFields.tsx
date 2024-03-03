import React, { ReactNode, useState } from 'react'
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
    const [loading, setLoading] = useState<boolean>()

    const getInsightData = () => {
        (
            async () => {
                try {
                    setLoading(true)
                    const body = {
                        integrationId: integrationId,
                        rawQuery: rawQuery
                    }
                    const insightDataResponse = await fetchDataAxios.post('/fetchData/query', body)
                    setInsightData(insightDataResponse.data);
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false)
                }
            }
        )();
    }

    const getQueryInputForIntegrationType = (): ReactNode => {
        if (integrationType === DataBaseType.POSTGRES_QL.valueOf() ||
            integrationType === DataBaseType.MY_SQL.valueOf()) {
            return (
                <SQLQueryInput
                    rawQuery={rawQuery}
                    setRawQuery={setRawQuery}
                    getInsightData={getInsightData}
                    loading={loading} />
            )
        }

        else if (integrationType === DataBaseType.MONGO_DB.valueOf()) {
            return (
                <MongoQueryInput
                    setRawQuery={setRawQuery}
                    getInsightData={getInsightData}
                    loading={loading} />
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
