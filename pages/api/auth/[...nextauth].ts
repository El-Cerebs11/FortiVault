import NextAuth from 'next-auth'

export const authOptions = {
  pages: {
    signIn: '/signin',
    signUp: '/signup',
  },
  providers: [],
}
export default NextAuth(authOptions)
