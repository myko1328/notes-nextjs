import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

// type Data = {
//   title: string
//   content: string
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const notedId = req.query.id
  if (req.method === 'DELETE') {
      const note = await prisma.note.delete({
          where: {
              id: Number(notedId)
          }
      })
      res.json(note)
  } else {
      console.log('NOTE COULD NOT BE DELETED')
  }
}
