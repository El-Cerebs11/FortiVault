import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";





async function checkToken  () {
    'use server'


    const session = await getServerSession(authOptions)



    try {

if(session?.user?.emailVerified){
return true
}

        const prisma = new PrismaClient()
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token: "searchParams.token as string",
                userId : session?.user?.id,
                expires: {
                    gte: new Date()
                  },
            },
        });

        if(verificationToken == null){
            return false
            }

        //  await prisma.verificationToken.update({
        //     where: verificationToken,
        //     data: {...verificationToken , expires : new Date()},
        //   })   


          await prisma.user.update({
            where:{id: session?.user?.id}
            , data:{emailVerified:new Date()}
          })
          await prisma.$disconnect();

          return true
        


        
       
    } catch (error) {
       return false
    }
}
