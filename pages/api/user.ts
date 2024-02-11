  // pages/api/user.ts

  import { NextApiRequest, NextApiResponse } from 'next'
  import { PrismaClient } from '@prisma/client'
  import { getById, getAll, create, update, remove, hashString } from '@/services/Query'

  const prisma = new PrismaClient()
  const model = prisma.user

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method === 'GET') {
      const objId = parseInt(req.query.id as string, 10)
      if (!isNaN(objId)) {
        return getById(objId, res, model)
      } else {
        return getAll(req, res, model)
      }
    } else if (req.method === 'POST') {
      req.body.password =await hashString(req.body.password)
      return create(req, res, model)
    } else if (req.method === 'PUT') {
      return update(req, res, model)
    } else if (req.method === 'DELETE') {
      return remove(req, res, model)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  }
