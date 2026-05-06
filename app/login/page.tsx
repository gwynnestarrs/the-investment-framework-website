'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")"

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') || '/course'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Incorrect email or password.')
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808', position: 'relative', overflow: 'hidden' }}>
      {/* Grain overlay */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.18, backgroundImage: GRAIN }} />

      {/* Radial glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />

      <div style={{ background: '#0F0F0F', border: '1px solid #1E1E1E', padding: '52px 56px 48px', width: '100%', maxWidth: 420, textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* Logo mark */}
        <div style={{ width: 44, height: 44, border: '1px solid #C9A84C', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <span style={{ color: '#C9A84C', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>IF</span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: '#F0EDE6', margin: '0 0 8px' }}>
          Course Access
        </h1>
        <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4A4A48', margin: '0 0 40px' }}>
          Sign in to your portal
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'left' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4A4A48' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{ background: '#080808', border: '1px solid #1E1E1E', color: '#F0EDE6', fontSize: 13, padding: '12px 14px', fontFamily: "'Montserrat', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' }}
              onFocus={e => (e.target.style.borderColor = '#C9A84C')}
              onBlur={e => (e.target.style.borderColor = '#1E1E1E')}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4A4A48' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ background: '#080808', border: '1px solid #1E1E1E', color: '#F0EDE6', fontSize: 13, padding: '12px 14px', fontFamily: "'Montserrat', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' }}
              onFocus={e => (e.target.style.borderColor = '#C9A84C')}
              onBlur={e => (e.target.style.borderColor = '#1E1E1E')}
            />
          </div>

          {error && (
            <p style={{ fontSize: 12, color: '#C0392B', margin: 0, textAlign: 'center' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D08A)', color: '#080808', border: 'none', padding: '14px 24px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Montserrat', sans-serif", marginTop: 4, opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p style={{ fontSize: 11, color: '#3A3A38', marginTop: 32, lineHeight: 1.6 }}>
          Don&apos;t have access yet?{' '}
          <a href="https://gwynnestarrs.github.io/the-investment-framework-website/" style={{ color: '#8B6914', textDecoration: 'none' }}>
            Purchase the course →
          </a>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
