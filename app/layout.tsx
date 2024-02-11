import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { AuthOptions, getServerSession } from 'next-auth'
import './globals.scss'
import { Inter } from 'next/font/google'
import SessionProvider from './SessionProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useRouter } from 'next/router'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang='en' >
    
      <body className={inter.className}>
    
        <SessionProvider session={session}>
        <Navbar  />
        <div className='dark:bg-gray-800'>
        {children}
        </div> 
        <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
