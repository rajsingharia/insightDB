import { userIntegrationResponse } from "@/app/(root)/addInsight/page";
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

interface AlertCreationSectionOneProps {
    title: string | undefined;
    setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
    rawQuery: string | undefined;
    setRawQuery: React.Dispatch<React.SetStateAction<string | undefined>>;
    integrationId: string | undefined;
    setIntegrationId: React.Dispatch<React.SetStateAction<string | undefined>>;
}


export const AlertCreationSectionOne: React.FC<AlertCreationSectionOneProps> = ({
    title,
    setTitle,
    rawQuery,
    setRawQuery,
    integrationId,
    setIntegrationId }) => {

    const [userIntegrations, setUserIntegrations] = useState<userIntegrationResponse[]>([]);
    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {

        (
            async () => {
                const customOrgAxios = CustomAxios.getOrgAxios();
                try {
                    //setLoading(true)
                    const userIntegrationsResponse = await customOrgAxios.get('/integrations')
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
        <div className="w-full h-full">
            {
                userIntegrations &&
                <div className="flex flex-col w-full h-full gap-10 p-2">
                    <Input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Enter Alert Title" />
                    <Select
                        value={integrationId}
                        onValueChange={(value: string) => {
                            setIntegrationId(value)
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
                    <Textarea
                        value={rawQuery}
                        rows={5}
                        onChange={e => setRawQuery(e.target.value)}
                        placeholder="Enter Raw Query" />
                </div>
            }
        </div>
    );
}
