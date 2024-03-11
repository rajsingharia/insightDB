import React, { ReactNode, useState } from 'react'
import CustomAxios from "@/utils/CustomAxios"
import { ICharts } from "@/interfaces/ICharts"
import { FetchDataResponse } from '@/app/(root)/addInsight/page';
import { SQLQueryInput } from '@/components/query/SQLQueryInput';
import { MongoQueryInput } from '@/components/query/MongoQueryInput';
import { DataBaseType } from 'insightdb-common'
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from '../ui/use-toast';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { RedisQueryInput } from './RedisQueryInput';


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
    setInsightData: React.Dispatch<React.SetStateAction<FetchDataResponse | undefined>> | undefined;
    rawQuery: string | undefined;
    setRawQuery: React.Dispatch<React.SetStateAction<string | undefined>>;
}


export const QueryFields: React.FC<QueryFieldsProps> = ({
    integrationId,
    integrationType,
    setInsightData,
    rawQuery,
    setRawQuery }) => {

    const fetchDataAxios = CustomAxios.getFetchDataAxios();
    const [loading, setLoading] = useState<boolean>()
    const { toast } = useToast()

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
                    if (setInsightData) setInsightData(insightDataResponse.data);
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false)
                }
            }
        )();
    }

    const getData = () => {

        if (!rawQuery || rawQuery.length == 0) {
            toast({ title: "Provide appropriate query input" })
            return
        }

        getInsightData()
    }

    const getQueryInputForIntegrationType = (): ReactNode => {
        if (integrationType === DataBaseType.POSTGRES_QL.valueOf() ||
            integrationType === DataBaseType.MY_SQL.valueOf()) {
            return (
                <SQLQueryInput
                    rawQuery={rawQuery}
                    setRawQuery={setRawQuery} />
            )
        }

        else if (integrationType === DataBaseType.MONGO_DB.valueOf()) {
            return (
                <MongoQueryInput
                    rawQuery={rawQuery}
                    setRawQuery={setRawQuery} />
            )
        }

        else if (integrationType === DataBaseType.REDIS.valueOf()) {
            return (
                <RedisQueryInput
                    rawQuery={rawQuery}
                    setRawQuery={setRawQuery} />
            )
        }

        return (
            <div>
                Query Input
            </div>
        )
    }


    return (
        <ScrollArea className="h-full w-full">
            <div className="flex flex-col h-full w-full gap-2">
                {
                    getQueryInputForIntegrationType()
                }
                {
                    setInsightData &&
                    <Button
                        onClick={getData}>
                        {
                            loading &&
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        }
                        {
                            loading ? "Fetching Data..." : "Get Data"
                        }
                    </Button>
                }
            </div>
        </ScrollArea>
    )
}
