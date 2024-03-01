import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import './globals.scss'
import SessionProvider from './SessionProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailVerificationAlert from '@/components/EmailVerificationAlert'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)


  return (
    <html lang='en'>
      <body>
        <SessionProvider session={session}>
          <Navbar />
        { session?.user?.emailVerified === null && (<EmailVerificationAlert></EmailVerificationAlert>)}
          <div className='dark:bg-gray-800 min-h-screen'>{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
