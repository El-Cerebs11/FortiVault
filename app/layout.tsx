import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import './globals.scss'
import SessionProvider from './SessionProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailVerificationAlert from '@/components/EmailVerificationAlert'
import { PrismaClient } from '@prisma/client'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  let realUser = null 
  if(session){
    const prisma = new PrismaClient()
     realUser = await prisma.user.findUnique({
      where: {
       id:session?.user?.id
      },
    })
    prisma.$disconnect()
  }

  return (
    <html lang='en'>
      <body>
        <SessionProvider session={session}>
          <Navbar />
        { realUser?.emailVerified === null && (<EmailVerificationAlert></EmailVerificationAlert>)}
          <div className='dark:bg-gray-800 min-h-screen'>{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
