import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { sendSetPasswordEmail } from '@/lib/email'
import crypto from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return new Response(`Webhook error: ${err}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email?.toLowerCase().trim()

    if (!email) {
      console.error('No email on checkout session', session.id)
      return new Response('No email on session', { status: 400 })
    }

    // Create user if they don't already exist
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({ data: { email } })
    }

    // Invalidate any existing unused tokens for this user
    await prisma.setPasswordToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    })

    // Generate a fresh single-use token (expires in 24 hours)
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.setPasswordToken.create({
      data: { token, userId: user.id, expiresAt },
    })

    await sendSetPasswordEmail(email, token)
    console.log(`Set-password email sent to ${email}`)
  }

  return new Response('OK', { status: 200 })
}
