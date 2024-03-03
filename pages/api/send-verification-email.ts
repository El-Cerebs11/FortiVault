import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { sendVerificationEmail } from '@/utils/utilsServer'
import { User } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (req.method === 'GET' && session?.user) {
    try {
      let info = await sendVerificationEmail(session.user as User)
      res.status(200).json({ message: 'Verification email sent successfully.' })
    } catch (error) {
      console.error('Failed to send verification email:', error)
      res.status(500).json({ error: 'Failed to send verification email.' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
