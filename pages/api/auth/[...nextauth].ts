import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials";
import { Adapter } from "next-auth/adapters";


const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials): Promise<any> {
      console.log('hello');
      
        
        const user = await prisma.user.findUnique({
          where: {
            email: (credentials as any).email,
            password: (credentials as any).password,
          },
        });

        console.log(user);
        

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};



export default NextAuth(authOptions)











