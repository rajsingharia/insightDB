
import React, { useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { Textarea } from "@/components/ui/textarea"

type QueryInputProps = {
    setRawQuery: React.Dispatch<React.SetStateAction<string>>;
    getInsightData: () => void
}

type FilterInput = {
    field: string;
    condition: string;
    value: string
}

type ProjectionInput = {
    field: string;
    alias?: string;
    aggregationType?: string;
}

interface QueryConditions {
    project: Record<string, number> | Record<string, Record<string, any>>;
    filters: Record<string, Record<string, any>>;
    sort: Record<string, number>;
    limit: number;
}

export const MongoQueryInput: React.FC<QueryInputProps> = ({
    setRawQuery,
    getInsightData
}) => {

    const { toast } = useToast()
    const [mongoRawQuery, setMongoRawQuery] = useState<string>("")
    const [collection, setCollection] = useState<string>("")
    const [projectionList, setProjectionList] = useState<ProjectionInput[]>([])
    const [filterList, setFilterList] = useState<FilterInput[]>([])
    const [sortBy, setSortBy] = useState<string>("")
    const [limit, setLimit] = useState<number>(0)

    const getData = () => {

        if (!collection || collection.length == 0) {
            toast({ title: "Collection Name is required" });
            return
        }

        const rawQueryObj: { collectionName: string; queryConditions: QueryConditions } = {
            collectionName: collection,
            queryConditions: {
                project: {},
                filters: {},
                sort: {},
                limit: 10,
            },
        };

        projectionList.forEach(projection => {
            if(projection.aggregationType && projection.alias) {
                rawQueryObj.queryConditions.project[projection.alias] = { [projection.aggregationType]: projection.field };
            } else {
                rawQueryObj.queryConditions.project[projection.field] = 1;
            } 
        });


        filterList.forEach(filter => {
            rawQueryObj.queryConditions.filters[filter.field] = {
                [filter.condition]: filter.value,
            };
        })

        rawQueryObj.queryConditions.sort[sortBy] = 1;

        rawQueryObj.queryConditions.limit = limit;

        setRawQuery(JSON.stringify(rawQueryObj))

        getInsightData()
    }



    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <Input
                value={collection}
                onChange={(event) => setCollection(event.target.value)}
                placeholder='Collection Name' />
            <Textarea
                placeholder="Raw Query"
                value={mongoRawQuery}
                onChange={(e) => setMongoRawQuery(e.target.value)}
            />
            <Button
                onClick={getData}>
                Get Data
            </Button>
        </div>
    )
}
