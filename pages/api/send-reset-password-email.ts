import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { sendResetPasswordEmail } from '@/utils/utilsServer'
import { PrismaClient, User } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
 
  if (req.method === 'GET') {
const prisma = new PrismaClient()
const user = await prisma.user.findUnique({where : {email : req.query?.email as string}})

if (user) {
    try {
        let info = await sendResetPasswordEmail(user)
        res.status(200).json({ message: 'Reset password email sent successfully.' })
      } catch (error) {
        res.status(500).json({ message: 'Failed to send Reset password email.' })
      }
} else {
    res.status(500).json({ message: 'Failed to send Reset password email.' })
}
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
