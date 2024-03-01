import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import { PrismaClient, User } from '@prisma/client'
import nodemailer from 'nodemailer'
import { randomUUID } from 'crypto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export async function getById(
  objId: string,
  res: NextApiResponse,
  model: any,
  filterOptions: {} = {}
) {
  try {
    const obj = await model.findUnique({
      where: { id: objId, ...filterOptions },
    })
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
  model: any,
  filterOptions: {} = {}
) {
  try {
    const allObj = await model.findMany({ where: filterOptions })
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
  model: any,
  filterOptions: {} = {}
) {
  const objId = req.query.id as string
  if (!objId) {
    return res.status(400).json({ error: 'Invalid ID' })
  }

  try {
    const updatedObj = await model.update({
      where: { id: objId, ...filterOptions },
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
  model: any,
  filterOptions: {} = {}
) {
  const objId = req.query.id as string
  if (!objId) {
    return res.status(400).json({ error: 'Invalid ID' })
  }

  try {
    await model.delete({ where: { id: objId, ...filterOptions } })
    res.status(200).json({ message: 'deleted successfully' })
  } catch (error) {
    console.error('Error deleting :', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function hashString(password: string): Promise<string> {
  try {
    const saltRounds: number = 10 // Recommended number of rounds
    const salt: string = await bcrypt.genSalt(saltRounds)
    const hash: string = await bcrypt.hash(password, salt)
    return hash
  } catch (error) {
    console.error('Error hashing password:', error)
    throw error
  }
}

export async function compareHash(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(plainTextPassword, hashedPassword)
  } catch (error) {
    console.error('Error comparing passwords:', error)
    throw error
  }
}

export enum VerificationTokenIdentifier {
  EMAIL_VERIFICATION = 'email_verification',
  FORGOT_PASSWORD = 'forgot_password',
}

export async function sendVerificationMail(user: User) {




  const prisma = new PrismaClient()

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: VerificationTokenIdentifier.EMAIL_VERIFICATION,
      token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // apres 24 heures
      user: { connect: { id: user.id } }, // Connect the user relation
    },
  })

prisma.$disconnect()

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GOOGLE_MAIL_USER,
      pass: process.env.GOOGLE_MAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken.token}`;

  const mailOptions = {
    from: process.env.GOOGLE_MAIL_USER, // Sender address
    to: user.email as string, // List of recipients
    subject: 'FortiVault: Verify your email', // Subject line
    text: `Please verify your email by clicking the following link: ${verificationUrl}`, // Plain text body
    html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}" target="_blank">Verify Email</a>`, // HTML body
  };

  // Send email
  return transporter.sendMail(mailOptions)
}





export async function checkToken(user: User, token: string, identifier: VerificationTokenIdentifier) {


  try {

   
      const prisma = new PrismaClient()
      const verificationToken = await prisma.verificationToken.findUnique({
        where: {
          token: token,
          userId: user.id,
          identifier: identifier,
          expires: {
            gte: new Date()
          },
        },
      });
    
      
      await prisma.$disconnect();
      if (verificationToken == null) {
        return false
      }
      else {
        return true
      }


  

  } catch (error) {
    return false
  }
}
