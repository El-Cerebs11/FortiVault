'use client'
import React, { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { useSession } from 'next-auth/react'
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default function VerifyEmail({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [verified, setVerified] = useState<boolean | null>(null)

  const apiUrl = '/api/verify-email/'
  useEffect(() => {
    axios
      .get(`${apiUrl}?token=${searchParams.token}`)
      .then((resp) => {
        setVerified(resp.data.verified)
      })
      .catch((error) => {
        setVerified(false)
      })
  }, [searchParams])

  const switchStatus = () => {
    const good = (
      <div className='font-normal text-gray-700 dark:text-gray-400'>
        Email has been verified successfully.{' '}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 inline-block mr-2 text-green-500'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M5 13l4 4L19 7'
          />
        </svg>
      </div>
    )

    const bad = (
      <div className='font-normal text-gray-700 dark:text-gray-400'>
        Email verification failed.
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 inline-block ml-2 text-red-500'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </div>
    )

    const wait = (
      <div className='font-normal text-gray-700 dark:text-gray-400'>
        verification progress ....
      </div>
    )

    switch (verified) {
      case true:
        return good

      case false:
        return bad

      default:
        return wait
    }
  }

  return (
    <div className='pt-2'>
      <div className=' mx-auto block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
        <p className='mb-2 text-2xl  text-gray-900 dark:text-white'>
          Email Verification
        </p>

        {switchStatus()}
      </div>
    </div>
  )
}
