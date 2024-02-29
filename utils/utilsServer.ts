import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import { User } from '@prisma/client'
import nodemailer from 'nodemailer';

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
    sendVerificationMail()
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



export function sendVerificationMail() {
  

 
  var transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "api",
      pass: "6aa7f20b0bc3e5aad5674639c2de4499"
    }
  });
  
  // Define email options
  const mailOptions = {
      from: 'donotreply@demomailtrap.com', // Sender address
      to: 'adil.abbadi.1996@gmail.com', // List of recipients
      subject: 'Test Email', // Subject line
      text: 'This is a test email sent from Node.js', // Plain text body
      html: '<b>This is a test email sent from <i>Node.js</i></b>', // HTML body
  };
  
  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error occurred:', error.message);
          return;
      }
      console.log('Email sent successfully!');
      console.log('Message ID:', info.messageId);
  });

  
}