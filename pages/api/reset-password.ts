import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { PrismaClient, User } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { VerificationTokenIdentifier, checkToken, hashString } from '@/utils/utilsServer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  if (req.method === 'POST') {
const prisma = new PrismaClient()
const user = await  prisma.user.findUnique({where : {email : req.body?.email as string}})


    const check = user ?  await checkToken(
    user as User,
      req.body.token as string,
      VerificationTokenIdentifier.FORGOT_PASSWORD
    ) : false

    if (check) {
     
      const hashedPassword = await hashString(req.body.password)
      await prisma.user.update({
        where: { id: user?.id },
        data: { password: hashedPassword },
      })
      prisma.$disconnect()
     return res.status(200).json({ passwordChanged: true})
    } else {
   return   res.status(200).json({ passwordChanged: false })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
