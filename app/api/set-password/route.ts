import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { token, password } = await req.json()

  if (!token || typeof token !== 'string') {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    return Response.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 },
    )
  }

  const record = await prisma.setPasswordToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!record) {
    return Response.json({ error: 'Invalid or expired link' }, { status: 400 })
  }
  if (record.used) {
    return Response.json(
      { error: 'This link has already been used. Please contact support.' },
      { status: 400 },
    )
  }
  if (record.expiresAt < new Date()) {
    return Response.json(
      { error: 'This link has expired. Please contact support for a new one.' },
      { status: 400 },
    )
  }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    }),
    prisma.setPasswordToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
  ])

  return Response.json({ success: true })
}
