import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareHash, hashString } from '@/services/Query'
import { DefaultSession } from 'next-auth' // Assuming next-auth is a module or file

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/signin',
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({ session, token, user }) => {
      if (session?.user) {
        session.user.id = token.uid as string
      }
      return session
    },

    jwt: async ({ token, user, account, profile }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: (credentials as any).email,
          },
        })

        if (user) {
          const checkHash = await compareHash(
            (credentials as any).password as string,
            user.password as string
          )

          if (checkHash) return user
        }

        return null
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
}

const handler = NextAuth(authOptions)

export default handler
