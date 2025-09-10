// pages/api/auth/request-reset.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { sendResetEmail } from '@/lib/mail'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(200).end() // avoid leaking existence

  // 1. Generate token & hash
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = await bcrypt.hash(token, 10)
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1h

  // 2. Store in DB
  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt }
  })

  // 3. Send email with link
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  await sendResetEmail(user.email, resetUrl)

  return res.status(200).json({ message: 'If your email exists, you’ll receive a reset link.' })
}