'use client'
import React, {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '/assets/logo.png'
import SlideOvers from './SlideOvers'
import { signIn, signOut, useSession } from 'next-auth/react'
import Profile from 'assets/profile-icon.jpg'
import { useRouter } from 'next/navigation'





export default function Navbar() {
    const [open , setOpen ] = useState(false)
    const session = useSession();
    const router = useRouter()
    const profileClick = () => {
        router.push('/profil')
    }

  return (
    <div className="navbar bg-base-100">
        <div className="navbar-start">
            <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                    <Link href="/" >Home</Link>
                </li>
                {/* <li hidden={ !( session.status == 'authenticated')}>
                    <Link href="profil" >Profil</Link>
                </li> */}
                   <li>
                    <Link href="#" >Formations</Link>
                </li>
                 <li>
                    <Link href="products" >Producs</Link>
                </li>
                <li>
                    <Link href="signin" >Sign in</Link>
                </li>
                <li>
                    <Link href="signup" >Sign up</Link>
                </li>
                <li>
                    <span onClick={() =>signOut()} >logout</span>
                </li>
            </ul>
            </div>
        </div>
        <div className="navbar-center">
            <div className="flex items-center justify-center">
               <span >FortiVault</span>
            </div>
        </div>
        <div className="navbar-end">
            <button 
                className="btn btn-ghost btn-circle border rounded-full "
                onClick={() => profileClick()}
            >
                <Image
                    hidden={ !( session.status == 'authenticated')}
                    src={Profile}
                    width={30}
                    height={30}
                    alt="Profile"
                />
            </button>
            <button className="btn btn-ghost btn-circle"
                onClick={() => setOpen(!open)}
            >
            <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
            </button>
            
        </div>
        {open ? <SlideOvers /> : null}

        
    </div>
  )
}
