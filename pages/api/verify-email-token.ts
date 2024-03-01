import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { VerificationTokenIdentifier, checkToken } from "@/utils/utilsServer";








export default async function handler(req: NextApiRequest,
    res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)
    if (req.method === 'GET' && session?.user) {
     const check = await checkToken(session.user as User , req.query.token as string , VerificationTokenIdentifier.EMAIL_VERIFICATION)
    
    
     if(check){
        const prisma = new PrismaClient()
        await prisma.user.update({where:{id : session.user.id } , data :{emailVerified : new Date()}})
        prisma.$disconnect()
        res.status(200).json({ message: "Verification email successfully." });
     }
     else{
        res.status(500).json({ error: "Failed to verify token." });
     }
    
    }
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
