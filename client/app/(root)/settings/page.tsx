
"use client"
import React, { useEffect, useState } from 'react'
import CustomAxios from '@/utils/CustomAxios';
import { IUser } from '@/interfaces/IUser';
import { CircularProgress } from '@/components/common/CircularProgress';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useToast } from '@/components/ui/use-toast';

type userIntegrationResponse = {
  id: string;
  name: string;
  type: string;
  credentials: JSON;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export default function Settings() {

  const [userIntegrations, setUserIntegrations] = useState<userIntegrationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>()
  const [allUsers, setAllUsers] = useState<IUser[]>()
  const { toast } = useToast()



  useEffect(() => {
    (
      async () => {
        const customAxios = CustomAxios.getOrgAxios();
        setLoading(true)
        try {
          const integrationsResponse = await customAxios.get('/integrations')
          setUserIntegrations(integrationsResponse.data)

          const allUsersResponse = await customAxios.get('/users/all')
          setAllUsers(allUsersResponse.data)

        } catch (error) {
          toast({ title: "Error : " + error });
        } finally {
          setLoading(false)
        }

      }
    )();

  }, [toast])

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
          <ScrollArea className="w-3/4 rounded h-full p-4">
            <div>User Integrations</div>
            <div className="flex flex-col justify-center items-center mt-4">
              {
                userIntegrations.map((integration) => {
                  return (
                    <div key={integration.id}>
                      <div>{integration.name}</div>
                      <div>{integration.type}</div>
                      {/* <div>{JSON.stringify(integration.credentials)}</div> */}
                    </div>
                  )
                })
              }
            </div>
          </ScrollArea>
          <ScrollArea className="w-1/4 h-full p-4">
            <h4 className="text-center font-mono font-semibold text-2xl mb-4">Add Integration</h4>
            <div className="flex flex-col w-full h-full rounded gap-5">
              {
                allUsers?.map((user) => (
                  <div
                    key={user.id}>
                    <div className="flex flex-row justify-center items-center grow gap-3">
                      <p className="mr-4 grow font-mono">{user.firstName}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </ScrollArea>
        </div>
      }
    </>
  )
}
