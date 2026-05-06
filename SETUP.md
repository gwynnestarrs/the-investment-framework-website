# Setup Guide — The Investment Framework Auth System

This guide walks you through deploying the full authentication system.
Estimated time: 30–45 minutes.

---

## What you're setting up

| Service | Purpose | Cost |
|---------|---------|------|
| **Vercel** | Hosts the app | Free |
| **Neon** | PostgreSQL database (stores users) | Free |
| **Resend** | Sends welcome emails | Free (3,000/mo) |
| **Stripe** | Receives payments + triggers user creation | % per transaction |

---

## Step 1 — Install dependencies

Open Terminal, navigate to this folder, then run:

```bash
npm install
```

---

## Step 2 — Set up the database (Neon)

1. Go to **[neon.tech](https://neon.tech)** and create a free account
2. Click **"New Project"** → name it `investment-framework`
3. On the dashboard, click **"Connection string"** and copy the URL
   - It looks like: `postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require`
4. Save this — you'll need it in Step 6

---

## Step 3 — Set up email (Resend)

1. Go to **[resend.com](https://resend.com)** and create a free account
2. Go to **API Keys** → **Create API Key** → copy it (starts with `re_`)
3. Go to **Domains** → add your domain (or use Resend's test domain for now)
4. Copy your verified sender email (e.g. `noreply@yourdomain.com`)

> **Note:** For testing without a custom domain, Resend lets you send to your own email
> from `onboarding@resend.dev` — just set `EMAIL_FROM=onboarding@resend.dev` temporarily.

---

## Step 4 — Set up Stripe webhook

1. Log in to **[dashboard.stripe.com](https://dashboard.stripe.com)**
2. Go to **Developers → Webhooks → Add endpoint**
3. Set endpoint URL to:
   ```
   https://YOUR-VERCEL-URL.vercel.app/api/webhooks/stripe
   ```
   (You'll get the Vercel URL in Step 7 — come back and do this after deploying)
4. Under **Events to listen to**, select: `checkout.session.completed`
5. Click **Add endpoint** → copy the **Signing secret** (starts with `whsec_`)
6. Also go to **Developers → API Keys** and copy your **Secret key** (starts with `sk_live_`)

---

## Step 5 — Update your Stripe Payment Link

In Stripe Dashboard:
1. Go to **Payment Links** → open your $300 link
2. Click **Edit** → **Confirmation page**
3. Set **"Don't show confirmation page"** and enter the redirect URL:
   ```
   https://YOUR-VERCEL-URL.vercel.app/payment-success
   ```
4. Save

---

## Step 6 — Create your environment file

In this project folder, create a new file called `.env.local` (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in all the values:

```env
DATABASE_URL="postgresql://..."          # from Step 2
NEXTAUTH_SECRET="paste-random-string"   # run: openssl rand -base64 32
NEXTAUTH_URL="https://your-app.vercel.app"  # from Step 7
STRIPE_SECRET_KEY="sk_live_..."          # from Step 4
STRIPE_WEBHOOK_SECRET="whsec_..."        # from Step 4
RESEND_API_KEY="re_..."                  # from Step 3
EMAIL_FROM="noreply@yourdomain.com"      # from Step 3
```

To generate the `NEXTAUTH_SECRET`, run this in Terminal:
```bash
openssl rand -base64 32
```

---

## Step 7 — Deploy to Vercel

1. Go to **[vercel.com](https://vercel.com)** and sign in with your GitHub account
2. Click **"Add New Project"**
3. Select your GitHub repo (`the-investment-framework-website`)
4. Under **"Root Directory"** — leave as `/` (project root)
5. Under **Environment Variables**, add all the variables from your `.env.local`
6. Click **Deploy**

Vercel will give you a URL like `https://the-investment-framework-xxxxx.vercel.app`

**Go back and complete Steps 4 and 5** with your real Vercel URL.

---

## Step 8 — Run the database migration

Once deployed, open Terminal and run:

```bash
npx prisma db push
```

This creates the `User` and `SetPasswordToken` tables in your database.

---

## Step 9 — Test the full flow

1. Open your Vercel URL — you should see the login page
2. Make a test purchase via Stripe (use card `4242 4242 4242 4242`)
3. Check your email for the "Set your password" link
4. Click it, set a password
5. Log in → you should land on the course

---

## Flow summary

```
User buys on Stripe Payment Link
         ↓
Stripe fires webhook → POST /api/webhooks/stripe
         ↓
User created in database
Secure token generated (24hr, single-use)
Welcome email sent via Resend
         ↓
User clicks email link → /set-password?token=XYZ
         ↓
Password hashed (bcrypt) and saved
Token marked as used
         ↓
User redirected to /login
         ↓
User logs in → JWT session created
         ↓
/course → middleware checks JWT → serves course.html
```

---

## File structure

```
app/
  login/page.tsx          ← Sign-in form
  set-password/page.tsx   ← Password setup (from email link)
  payment-success/page.tsx ← "Check your email" page after Stripe
  api/
    auth/[...nextauth]/   ← NextAuth session handler
    webhooks/stripe/      ← Stripe webhook (creates user + sends email)
    set-password/         ← Validates token + saves hashed password
    serve-course/         ← Serves course.html to authenticated users
lib/
  auth.ts                 ← NextAuth config
  prisma.ts               ← Database client
  email.ts                ← Welcome email template (Resend)
prisma/
  schema.prisma           ← User + SetPasswordToken tables
middleware.ts             ← Protects /course route
```

---

## Adding users manually (optional)

If you ever need to give someone access without them purchasing (e.g., a refund/replacement),
you can create a token manually via the Neon SQL editor:

```sql
-- First find or create the user
INSERT INTO "User" (id, email, "createdAt") 
VALUES (gen_random_uuid()::text, 'email@example.com', NOW())
ON CONFLICT (email) DO NOTHING;

-- Then create a token (valid 48 hours)
INSERT INTO "SetPasswordToken" (id, token, "userId", "expiresAt", used, "createdAt")
VALUES (
  gen_random_uuid()::text,
  encode(gen_random_bytes(32), 'hex'),
  (SELECT id FROM "User" WHERE email = 'email@example.com'),
  NOW() + INTERVAL '48 hours',
  false,
  NOW()
);

-- Get the token to send manually
SELECT token FROM "SetPasswordToken" 
WHERE "userId" = (SELECT id FROM "User" WHERE email = 'email@example.com')
AND used = false
ORDER BY "createdAt" DESC LIMIT 1;
```

Then send the person this URL:
`https://your-app.vercel.app/set-password?token=TOKEN_FROM_ABOVE`
