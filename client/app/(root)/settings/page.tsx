
"use client"
import React, { useEffect, useState } from 'react'
import CustomAxios from '@/utils/CustomAxios';
import { IUser } from '@/interfaces/IUser';
import { CircularProgress } from '@/components/common/CircularProgress';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { getImageForDB } from '@/components/common/GetImageForDB';
import { User } from 'lucide-react';

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
        const fetchDataAxios = CustomAxios.getFetchDataAxios();
        const orgAxios = CustomAxios.getOrgAxios();
        setLoading(true)
        try {
          const integrationsResponse = await fetchDataAxios.get('/integrations')
          setUserIntegrations(integrationsResponse.data)

          const allUsersResponse = await orgAxios.get('/user/all')
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
            <div>Organisation Integrations</div>
            <div className="flex flex-col justify-center items-center mt-4 gap-3">
              {
                userIntegrations.map((integration) => {
                  return (
                    <div
                      key={integration.id}
                      className="flex flex-row justify-center items-center w-full cursor-pointer border-2 border-purple-500 border-opacity-30 rounded p-4">
                      <div className="flex flex-row justify-center items-center grow gap-3">
                        {
                          getImageForDB(integration.type, 10)
                        }
                        <p className="mr-4 grow font-mono">{integration.name}</p>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </ScrollArea>
          <ScrollArea className="w-1/4 h-full p-4">
            <h4 className="text-center font-mono font-semibold text-2xl mb-4">Users In Organisation</h4>
            <div className="flex flex-col w-full h-full rounded gap-5">
              {
                allUsers?.map((user) => (
                  <div
                    key={user.id}>
                    <div className="flex flex-row w-full justify-center items-center grow gap-3">
                      <User />
                      <p className="mr-4 grow font-mono">{user.firstName + " " + user.lastName}</p>
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
