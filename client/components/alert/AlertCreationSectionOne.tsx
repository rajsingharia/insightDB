import { FetchDataResponse, userIntegrationResponse } from "@/app/(root)/addInsight/page";
import CustomAxios from "@/utils/CustomAxios";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Card, CardContent } from "../ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { CircularProgress } from "../common/CircularProgress";
import { QueryFields } from "../query/QueryFields";

interface AlertCreationSectionOneProps {
    title: string | undefined;
    setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
    rawQuery: string;
    setRawQuery: React.Dispatch<React.SetStateAction<string>>;
    selectedIntegration: userIntegrationResponse | undefined;
    setSelectedIntegration: React.Dispatch<React.SetStateAction<userIntegrationResponse | undefined>>;
}


export const AlertCreationSectionOne: React.FC<AlertCreationSectionOneProps> = ({
    title,
    setTitle,
    rawQuery,
    setRawQuery,
    selectedIntegration,
    setSelectedIntegration }) => {

    const [userIntegrations, setUserIntegrations] = useState<userIntegrationResponse[]>([]);
    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(true)
    const [insightData, setInsightData] = useState<FetchDataResponse>()

    useEffect(() => {

        (
            async () => {
                const fetchDataAxios = CustomAxios.getFetchDataAxios();
                try {
                    setLoading(true)
                    const userIntegrationsResponse = await fetchDataAxios.get('/integrations')
                    setUserIntegrations(userIntegrationsResponse.data)
                } catch (error) {
                    console.log(error);
                    toast({ title: "Error : " + error })

                } finally {
                    setLoading(false)
                }
            }
        )();

    }, [toast]);

    return (
        <>
            {
                loading &&
                <div className="flex flex-col justify-center items-center w-full h-full ">
                    <CircularProgress />
                </div>
            }
            {
                !loading &&
                <div className="w-full h-full">
                    {
                        userIntegrations &&
                        <div className="flex flex-col w-full h-full gap-2 p-2">
                            <Input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Enter Alert Title" />
                            <Select
                                value={selectedIntegration?.id}
                                onValueChange={(value: string) => {
                                    setSelectedIntegration(
                                        userIntegrations.find((integration) => integration.id == value)
                                    )
                                }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Integration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            userIntegrations.map((integration) => (
                                                <SelectItem
                                                    key={integration.id}
                                                    value={integration.id}>
                                                    {integration.name}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {
                                selectedIntegration &&
                                <QueryFields
                                    integrationId={selectedIntegration?.id}
                                    integrationType={selectedIntegration?.type}
                                    setInsightData={undefined}
                                    rawQuery={rawQuery}
                                    setRawQuery={setRawQuery}
                                />
                            }
                            {/* <Textarea
                                value={rawQuery}
                                rows={5}
                                onChange={e => setRawQuery(e.target.value)}
                                placeholder="Enter Raw Query" /> */}
                        </div>
                    }
                </div>
            }
        </>
    );
}
