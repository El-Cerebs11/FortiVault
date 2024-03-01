import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import './globals.scss'
import SessionProvider from './SessionProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WarningAlert from '@/components/WarningAlert'

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
          <WarningAlert title='hi' message='adilo'></WarningAlert>
          <div className='dark:bg-gray-800 min-h-screen'>{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
