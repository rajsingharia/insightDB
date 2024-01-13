"use client"

import { useTheme } from "next-themes"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from '../ui/button'
import {
    BadgePlus,
    Bell,
    Blocks,
    CircleUser,
    Home,
    Moon,
    Settings,
    Sun
} from 'lucide-react'


const sideBarPages = [
    {
        to: "/",
        icon: <Home width={22} height={22} />,
        activeIcon: <Home width={22} height={22} color="#567CFF" />
    },
    {
        to: "/addInsight",
        icon: <BadgePlus width={22} height={22} />,
        activeIcon: <BadgePlus width={22} height={22} color="#7eff7a" />
    },
    {
        to: "/integrations",
        icon: <Blocks width={22} height={22} />,
        activeIcon: <Blocks width={22} height={22} color="#8D4BE0" />
    },
    {
        to: "/settings",
        icon: <Settings width={22} height={22} />,
        activeIcon: <Settings width={22} height={22} color="#7AF8FF" />
    },
    {
        to: "alerts",
        icon: <Bell width={22} height={22} />,
        activeIcon: <Bell width={22} height={22} color="#7AF8FF" />
    }
]


export const SideBar = () => {

    const pathname = usePathname()
    const { setTheme } = useTheme()

    return (
        <Card className="flex flex-col justify-center items-center h-full w-14">
            <div className="flex flex-col mt-5 items-center grow w-full">
                {
                    sideBarPages.map((page, index) => {
                        const isActive = pathname === page.to
                        return (
                            <div key={index} className='mb-3 flex justify-center items-center w-10 h-10 rounded' >
                                <Link href={page.to}>
                                    {
                                        isActive ? page.activeIcon : page.icon
                                    }
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
            <div className="mb-3">
                {
                    <Button variant="outline" size="icon">
                        <Sun onClick={() => setTheme("dark")} className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon onClick={() => setTheme("light")} className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                }
            </div>
            <div className="mb-4">
                <Link href='/account'>
                    {pathname === '/account' ? <CircleUser width={22} height={22} color="#D875FF" /> : <CircleUser width={22} height={22} />}
                </Link>
            </div>
        </Card>
    )
}
