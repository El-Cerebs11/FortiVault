import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string
    name: String | null
    email: String | null
    emailVerified: DateTime
    image: string | null
  }
  interface Session {
    user?: User & DefaultSession['user']
    accessToken: string
  }
}
