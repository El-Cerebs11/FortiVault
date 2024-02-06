import { NextApiRequest, NextApiResponse } from 'next'

export async function getById(objId: number, res: NextApiResponse, model: any) {
  try {
    const obj = await model.findUnique({ where: { id: objId } })
    if (obj) {
      res.status(200).json(obj)
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  } catch (error) {
    console.error('Error fetching :', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getAll(
  req: NextApiRequest,
  res: NextApiResponse,
  model: any
) {
  try {
    const allObj = await model.findMany()
    res.status(200).json(allObj)
  } catch (error) {
    console.error('Error fetching :', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function create(
  req: NextApiRequest,
  res: NextApiResponse,
  model: any
) {
  try {
    const newObj = await model.create({ data: req.body })
    res.status(201).json(newObj)
  } catch (error) {
    console.error('Error creating :', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function update(
  req: NextApiRequest,
  res: NextApiResponse,
  model: any
) {
  const objId = parseInt(req.query.id as string, 10)
  if (isNaN(objId)) {
    return res.status(400).json({ error: 'Invalid ID' })
  }

  try {
    const updatedObj = await model.update({
      where: { id: objId },
      data: req.body,
    })
    res.status(200).json(updatedObj)
  } catch (error) {
    console.error('Error updating :', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function remove(
  req: NextApiRequest,
  res: NextApiResponse,
  model: any
) {
  const objId = parseInt(req.query.id as string, 10)
  if (isNaN(objId)) {
    return res.status(400).json({ error: 'Invalid ID' })
  }

  try {
    await model.delete({ where: { id: objId } })
    res.status(200).json({ message: 'deleted successfully' })
  } catch (error) {
    console.error('Error deleting :', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
