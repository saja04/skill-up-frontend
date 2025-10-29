'use client'
import { User } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function NavBar() {

    const [user, setUser] = useState<User | undefined>()

    function handleDBReset() {
        localStorage.removeItem('db')
        console.log('db borrada del local storage')
        window.location.reload()
    }

    useEffect(() => {
        async function main() {
            const rawUser = localStorage.getItem('user') as string;
            const parsedUser = JSON.parse(rawUser);

            if(parsedUser) {
                setUser(parsedUser);
            }
        }
        main()
    }, [])

    return(
        <div className="hidden md:flex lg:flex w-screen flex-row justify-between align-middle items-center h-25">
            <Link href={'/'} className="hover:underline text-3xl ml-10">Skill <span className="text-green-700">UP</span></Link>
            <input type="text" className="search" placeholder="Buscar propuestas..." />
            <div className="w-auto flex flex-row justify-around gap-10 mr-10">
                <Link href={'/'} className="lnk">Acerca de nosotros</Link>
                { user ? (
                        <Link href={'/user'} className="lnk flex flex-row items-center gap-2">
                            <Image className="" width={15} height={15} src={'/userr.png'} alt='user' />
                            { user.info ? (user.info.user_name) : ('Usuario')}
                            </Link>
                    ) : (
                        <></>
                    )
                }
                <button onClick={handleDBReset} className="lnk">Reestablecer db</button>
            </div>
        </div>
    )
}