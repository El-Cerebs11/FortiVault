'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const session = useSession()

  const router = useRouter()

  return (
    <div className='flex items-center h-screen'>
      <div className='mx-auto max-w-2xl py-28 sm:py-30 lg:py-40'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold tracking-tight  sm:text-6xl dark:text-white'>
            Welcome to FortiVault
          </h1>
          <p className='mt-6 text-lg leading-8 text-black dark:text-white'>
            Welcome{' '}
            <span
              hidden={session?.data?.user?.email ? false : true}
              className='bg-green-100 text-green-800 font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'
            >
              {session?.data?.user?.email}
            </span>{' '}
            to our secure password manager! Your security matters to us. Store
            and manage passwords with ease. Say hello to worry-free logins!
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <button
              onClick={() =>{
                if (session?.data?.user)
          
                router.push('/password-app')
                else

                router.push('/signin')
              }}
              className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
