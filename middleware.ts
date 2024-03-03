import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({ req })
    const isAuthenticated = !!token


    const protectedAuth = ['/signin', '/signup', '/forgot-password' , '/reset-password'];
    const protectedAnonymos = ['/password', '/verify-email'];
const pathname = req.nextUrl.pathname;


for (const path of protectedAuth) {
  if (pathname.startsWith(path) && isAuthenticated) {
   return NextResponse.redirect(new URL('/', req.url));
  }
}


for (const path of protectedAnonymos) {
  if (pathname.startsWith(path) && !isAuthenticated) {
  return NextResponse.redirect(new URL('/signin', req.url));
  }
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
