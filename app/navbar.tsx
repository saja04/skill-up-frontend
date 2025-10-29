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
        <div className="mt-5 gap-5 flex lg:mt-0 lg:gap-0 md:mt-0 md:gap-0 w-screen flex-col lg:flex-row md:flex-row lg:h-25 md:h-25 lg:justify-between md:justify-between align-middle items-center h-fit">
            <Link href={'/'} className="hover:underline text-3xl lg:ml-10 md:ml-10">Skill <span className="text-green-700">UP</span></Link>
            <input type="text" className="search hidden lg:flex md:flex" placeholder="Buscar propuestas..." />
            <div className="w-fit flex flex-col lg:flex-row md:flex-row justify-around gap-3 lg:mr-10 md:mr-10 lg:gap-10 md:gap-10">
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