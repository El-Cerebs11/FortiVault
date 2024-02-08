'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PrismaClient } from '@prisma/client'

export default function Home() {
  const session = useSession({
    required: false,
  })

  const prisma = new PrismaClient()

  const router = useRouter()

  useEffect(() => {}, [])

  return (
    <div className='bg-grey-900 h-screen flex items-center p-6'>
      <div className='mx-auto max-w-2xl py-28 sm:py-30 lg:py-40'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl'>
            Welcome to FortiVault
          </h1>
          <p className='mt-6 text-lg leading-8 text-black'>
            Welcome student {session?.data?.user?.email} in this platform you
            will find anything you need as a student to learn and improve your
            skills in IT world.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <a
              href='#'
              onClick={() => router.push('/services')}
              className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Get started
            </a>
            <a
              href='about'
              className='text-sm font-semibold leading-6 text-gray-400'
            >
              Learn more <span aria-hidden='true'>→</span>
            </a>
          </div>
        </div>
      </div>
      <div
        className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'
        aria-hidden='true'
      >
        <div
          className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>


 
    </div>
  )
}
