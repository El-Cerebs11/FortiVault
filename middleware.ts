import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './pages/api/auth/[...nextauth]'
import { getToken } from 'next-auth/jwt'
import { signIn } from 'next-auth/react'

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({ req })
    const isAuthenticated = !!token

    if (
      (req.nextUrl.pathname.startsWith('/signin') ||
        req.nextUrl.pathname.startsWith('/signup')) &&
      isAuthenticated
    ) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    if (req.nextUrl.pathname.startsWith('/password') && !isAuthenticated) {
      return NextResponse.redirect(new URL('/signin', req.url))
    }

    return NextResponse.next()
  },

  {
    callbacks: {
      authorized({ token }) {
        return true
      },
    },
  }
)
