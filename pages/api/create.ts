import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

// type Data = {
//   title: string
//   content: string
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {title, content} = req.body

  try {
      await prisma.note.create({
        data: {
            title,
            content
        }
      })
      res.status(200).json({
        message: 'Note created'
      })
  } catch (error) {
      console.log('Fail')
  }
}
