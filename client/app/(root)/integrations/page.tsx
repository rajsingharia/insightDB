
"use client"

import { useEffect, useState } from "react"
import AuthAxios from "@/utils/AuthAxios";
import { ChevronsRight } from "lucide-react";
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

type RequiredCredentials = {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

enum DataBaseType {
  POSTGRES_QL,
  MONGO_DB,
  MY_SQL,
  ORACLE,
  CASSANDRA,
  DYNAMO_DB,
  REDIS,
  KAFKA,
  REST_API,
  RABBIT_MQ,
  ELASTIC_SEARCH
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
  const authAxios = AuthAxios.getAuthAxios();
  const [clickedIntegration, setClickedIntegration] = useState<Integration | null>(null)

  useEffect(() => {
    authAxios.get('/integrations/supported')
      .then((res: { data: Integration[] }) => {
        console.log(res.data)
        setSupportedIntegrations(res.data)
      })
      .catch((err: unknown) => {
        console.log(err)
      });
  }, []);


  const addIntegration = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredCredentials = clickedIntegration?.requiredCredentials;

    let credentials: JSON | null = null;

    credentials = requiredCredentials?.reduce((acc, credential) => {
      const value = (document.getElementById(credential.name) as HTMLInputElement).value;
      return { ...acc, [credential.name]: value }
    }, {} as JSON) ?? null;


    const body: IntegrationCreateBody = {
      name: clickedIntegration?.name || '',
      type: clickedIntegration?.type || '',
      credentials: credentials
    }
    console.log(body)
    authAxios.post('/integrations', {
      integration: body
    })
      .then((res: { data: unknown }) => {
        console.log(res.data)
      })
      .catch((err: unknown) => {
        console.log(err)
      });
  }


  return (
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
                  <img src={integration.icon} alt="logo" className="w-10 h-10" />
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
              <div className="flex flex-col justify-center w-full p-10">
                {
                  clickedIntegration?.requiredCredentials.map((credential) => (
                    <div key={credential.name} className="flex flex-row justify-center items-center py-3 w-full">
                      <div className="flex flex-col justify-center items-center">
                        <p className="mr-4">{credential.name}</p>
                      </div>
                      <Input
                        id={credential.name}
                        placeholder={credential.name}
                      />
                    </div>
                  ))
                }
              </div>
              <div className="flex flex-row justify-center items-center py-3 w-full ">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  type="submit">
                  Add
                </button>
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
  )
}
