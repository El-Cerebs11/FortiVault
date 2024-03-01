import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

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
