
"use client"

import { useEffect, useState } from "react"
import CustomAxios from "@/utils/CustomAxios";
import { ChevronsRight } from "lucide-react";
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { CircularProgress } from "@/components/common/CircularProgress";
import { Button } from "@/components/ui/button";
import { getImageForDB } from "@/components/common/GetImageForDB";

type RequiredCredentials = {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

type Integration = {
  id: number;
  type: string;
  name: string;
  icon?: string;
  requiredCredentials?: Array<RequiredCredentials>;
  group?: string;
}


type IntegrationCreateBody = {
  name: string;
  type: string;
  credentials: JSON | null;
}

export default function IntegrationsPage() {

  const [supportedIntegrations, setSupportedIntegrations] = useState<Integration[]>([])
  const [name, setName] = useState<string>()

  const [clickedIntegration, setClickedIntegration] = useState<Integration | null>(null)
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const customAxios = CustomAxios.getFetchDataAxios();
    customAxios.get('integrations/supported')
      .then((res: { data: Integration[] }) => {
        console.log(res.data)
        setSupportedIntegrations(res.data)
      })
      .catch((err) => {
        console.log(err)
        toast({ title: "Error fetching supported integrations : " + err.message })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [toast]);


  const addIntegration = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredCredentials = clickedIntegration?.requiredCredentials;

    let credentials: JSON | null = null;

    credentials = requiredCredentials?.reduce((acc, credential) => {
      const value = (document.getElementById(credential.name) as HTMLInputElement).value;
      return { ...acc, [credential.name]: value }
    }, {} as JSON) ?? null;


    const body: IntegrationCreateBody = {
      name: name || '',
      type: clickedIntegration?.type || '',
      credentials: credentials
    }
    console.log(body)
    const customAxios = CustomAxios.getFetchDataAxios();
    customAxios.post('/integrations', { integration: body })
      .then((res) => {
        console.log(res.data)
        toast({ title: "Integration added : " })
        location.reload();
      })
      .catch((err) => {
        console.log(err)
        toast({ title: "Error adding user integration : " + err.message })
      });

  }

  const checkConnection = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const requiredCredentials = clickedIntegration?.requiredCredentials;

    let credentials: JSON | null = null;

    credentials = requiredCredentials?.reduce((acc, credential) => {
      const value = (document.getElementById(credential.name) as HTMLInputElement).value;
      return { ...acc, [credential.name]: value }
    }, {} as JSON) ?? null;


    const body = {
      integrationType: clickedIntegration?.type || '',
      integrationCredentials: credentials
    }

    const customAxios = CustomAxios.getFetchDataAxios();
    customAxios.post('/checkConnection', body)
      .then((res) => {
        toast({ title: "Connection successful ✅" });
      })
      .catch((err) => {
        toast({ title: "Connection un-successful ❌: " + err.response.data });
      });
  }



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
        <div className='w-full h-full flex flex-row gap-4'>
          <ScrollArea className="w-1/4 h-full p-4">
            <h4 className="text-center font-mono font-semibold text-2xl mb-4">Add Integration</h4>
            <div className="flex flex-col w-full h-full rounded gap-5">
              {
                supportedIntegrations.map((integration) => (
                  <div
                    key={integration.id}
                    className={clickedIntegration?.id == integration.id ?
                      "flex flex-row justify-center items-center w-full cursor-pointer border-2 border-purple-500 rounded bg-purple-500 bg-opacity-30 p-4" :
                      "flex flex-row justify-center items-center w-full cursor-pointer border-2 border-purple-500 border-opacity-30 rounded p-4"}
                    onClick={() => setClickedIntegration(integration)}>
                    <div className="flex flex-row justify-center items-center grow gap-3">
                      {
                        getImageForDB(integration.type, 10)
                      }
                      <p className="mr-4 grow font-mono">{integration.name}</p>
                    </div>
                    <ChevronsRight color="white" />
                  </div>
                ))
              }
            </div>
          </ScrollArea>
          <ScrollArea className="w-3/4 rounded h-full p-4">
            {
              clickedIntegration?.requiredCredentials ?
                <form className="flex flex-col justify-center items-center" onSubmit={addIntegration}>
                  <h4 className="text-center decoration-2 font-mono text-2xl">
                    Add Credentials for {clickedIntegration?.name}
                  </h4>
                  <div className="flex flex-row justify-center w-full py-3">
                    <div className="flex flex-col justify-center items-center">
                      <p className="mr-4">Name</p>
                    </div>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Required"
                    />
                  </div>
                  <div className="flex flex-col justify-center w-full">
                    {
                      clickedIntegration?.requiredCredentials.map((credential) => (
                        <div key={credential.name} className="flex flex-row justify-center items-center py-3 w-full">
                          <div className="flex flex-col justify-center items-center">
                            <p className="mr-4">{credential.name}</p>
                          </div>
                          <Input
                            id={credential.name}
                            placeholder={credential.required ? "Required" : "Optional"}
                            type={credential.type}
                          />
                        </div>
                      ))
                    }
                  </div>
                  <div className="flex flex-row justify-end items-center py-3 w-full gap-3">
                    <Button variant='secondary' onClick={(event) => checkConnection(event)}> Check Connection </Button>
                    <Button type="submit"> Add </Button>
                  </div>
                </form>
                :
                <div className="flex flex-col justify-center items-center h-full w-full ">
                  <div className="text-center font-mono text-l border-purple-500 border-2 p-4 rounded-lg border-opacity-60">
                    Select an integration from the left
                  </div>
                </div>
            }
          </ScrollArea>
        </div>
      }
    </>
  )
}
