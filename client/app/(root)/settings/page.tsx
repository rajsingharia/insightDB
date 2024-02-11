
"use client"
import React, { useEffect, useState } from 'react'
import AuthAxios from '@/utils/AuthAxios';

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

  const authAxios = AuthAxios.getFetchDataAxios();

  useEffect(() => {

    authAxios.get('/integrations')
      .then((res) => {
        setUserIntegrations(res.data)
      })
      .catch((err) => {
        console.log(err)
      });

  }, [])

  return (
    <div className="flex flex-row justify-center items-center h-full">
      <div className="flex flex-col justify-start items-center bg-slate-300 h-full w-1/2 p-5">
        <div>User Integrations</div>
        <div className="flex flex-col justify-center items-center mt-4">
          {
            userIntegrations.map((integration) => {
              return (
                <div key={integration.id}>
                  <div>{integration.name}</div>
                  <div>{integration.type}</div>
                  <div>{JSON.stringify(integration.credentials)}</div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
