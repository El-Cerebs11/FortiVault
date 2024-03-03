import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getById, getAll, create, update, remove } from '@/utils/utilsServer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

const prisma = new PrismaClient()
const model = prisma.passwordManager

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  const filterOptions = { userId: session?.user?.id }

  if (filterOptions.userId == null || filterOptions.userId == undefined) {
    return res.status(401).json({ error: 'User not authentificated' })
  }
  if (req.method === 'GET') {
    const objId = req.query.id as string
    if (objId) {
      return getById(objId, res, model, filterOptions)
    } else {
      return getAll(req, res, model, filterOptions)
    }
  } else if (req.method === 'POST') {
    req.body.userId = filterOptions.userId
    return create(req, res, model)
  } else if (req.method === 'PUT') {
    return update(req, res, model, filterOptions)
  } else if (req.method === 'DELETE') {
    return remove(req, res, model, filterOptions)
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
