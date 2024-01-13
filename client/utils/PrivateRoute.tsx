"use client"

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PrivateRoute({ children }: React.PropsWithChildren<{ children: React.ReactNode }>) {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter()
    if(isLoggedIn != null && !isLoggedIn) {
        router.replace('/auth')
    }
    return ( children );
};
