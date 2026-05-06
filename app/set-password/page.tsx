'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")"

function SetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const res = await fetch('/api/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.')
    } else {
      setDone(true)
      setTimeout(() => router.push('/login'), 2800)
    }
  }

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#080808',
    position: 'relative' as const,
    overflow: 'hidden',
  }

  const cardStyle = {
    background: '#0F0F0F',
    border: '1px solid #1E1E1E',
    padding: '52px 56px 48px',
    width: '100%',
    maxWidth: 420,
    textAlign: 'center' as const,
    position: 'relative' as const,
    zIndex: 1,
  }

  if (done) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, border: '1px solid #C9A84C', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
            <span style={{ color: '#C9A84C', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>IF</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: '#F0EDE6', margin: '0 0 16px' }}>
            Password Set
          </h1>
          <p style={{ fontSize: 13, color: '#8A8880', lineHeight: 1.7 }}>
            Your account is ready. Redirecting to login…
          </p>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, border: '1px solid #1E1E1E', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
            <span style={{ color: '#4A4A48', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>IF</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 400, color: '#F0EDE6', margin: '0 0 16px' }}>
            Invalid Link
          </h1>
          <p style={{ fontSize: 13, color: '#8A8880', lineHeight: 1.7 }}>
            This link is missing a token. Please use the link from your welcome email, or contact support.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.18, backgroundImage: GRAIN }} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />

      <div style={cardStyle}>
        <div style={{ width: 44, height: 44, border: '1px solid #C9A84C', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <span style={{ color: '#C9A84C', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>IF</span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: '#F0EDE6', margin: '0 0 8px' }}>
          Set Your Password
        </h1>
        <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4A4A48', margin: '0 0 40px' }}>
          Choose a password to access your course
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'left' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4A4A48' }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              style={{ background: '#080808', border: '1px solid #1E1E1E', color: '#F0EDE6', fontSize: 13, padding: '12px 14px', fontFamily: "'Montserrat', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' }}
              onFocus={e => (e.target.style.borderColor = '#C9A84C')}
              onBlur={e => (e.target.style.borderColor = '#1E1E1E')}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4A4A48' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
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
            {loading ? 'Setting password…' : 'Activate Account →'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense>
      <SetPasswordForm />
    </Suspense>
  )
}
