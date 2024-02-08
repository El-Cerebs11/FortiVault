import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { AuthOptions, getServerSession } from 'next-auth'
import './globals.css'
import { Inter } from 'next/font/google'
import SessionProvider from './SessionProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useRouter } from 'next/router'

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
        <Navbar />
          {children}
        </SessionProvider>
        <Footer />
      </body>
    </html>
  )
}
