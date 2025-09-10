// pages/api/auth/reset-password.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, password } = req.body
  if (!token || !password) return res.status(400).end('Invalid request')

  // 1. Lookup all non-used, non-expired tokens
  const records = await prisma.passwordResetToken.findMany({
    where: { used: false, expiresAt: { gt: new Date() } }
  })

  // 2. Find matching hash
  const match = await Promise.all(
    records.map(async r => ({ ...r, ok: await bcrypt.compare(token, r.tokenHash) }))
  ).then(xs => xs.find(x => x.ok))

  if (!match) return res.status(400).end('Token invalid or expired')

  // 3. Update user password
  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.update({
    where: { id: match.userId },
    data: { password: hashed }
  })

  // 4. Mark token used
  await prisma.passwordResetToken.update({
    where: { id: match.id },
    data: { used: true }
  })

  return res.status(200).end('Password reset successful')
}