
import React, { useState } from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from "@/components/ui/textarea"
import { Label } from '@radix-ui/react-select';
import { ReloadIcon } from '@radix-ui/react-icons';

type QueryInputProps = {
    setRawQuery: React.Dispatch<React.SetStateAction<string>>,
    getInsightData: () => void,
    loading: boolean | undefined
}


export const MongoQueryInput: React.FC<QueryInputProps> = ({
    setRawQuery,
    getInsightData,
    loading
}) => {

    const [collection, setCollection] = useState<string>("")
    const [mongoRawQuery, setMongoRawQuery] = useState<string>("")

    const getData = () => {

        const query = {
            collection: collection,
            rawQuery: mongoRawQuery
        }

        setRawQuery(JSON.stringify(query))

        getInsightData()
    }



    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <Input
                value={collection}
                onChange={(event) => setCollection(event.target.value)}
                placeholder='Collection Name' />

            <p className="text-sm text-muted-foreground">{"example: name=john&age>21&fields=name,age&sort=name,-age&offset=10&limit=10"}</p>

            <Input
                id='mongoDBQuery'
                value={mongoRawQuery}
                onChange={(event) => setMongoRawQuery(event.target.value)}
                placeholder='MongoDB Query' />
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
        </div>
    )
}
