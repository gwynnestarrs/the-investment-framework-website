export default function PaymentSuccessPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>

        <div style={{ width: 44, height: 44, border: '1px solid #C9A84C', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
          <span style={{ color: '#C9A84C', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>IF</span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 400, color: '#F0EDE6', margin: '0 0 20px', lineHeight: 1.3 }}>
          Payment Successful
        </h1>

        <p style={{ fontSize: 14, color: '#8A8880', lineHeight: 1.8, margin: '0 0 16px' }}>
          Welcome to The Investment Framework.
        </p>
        <p style={{ fontSize: 14, color: '#8A8880', lineHeight: 1.8, margin: 0 }}>
          Check your email — you&apos;ll receive a link to set your password
          and access your course within the next few minutes.
          <br /><br />
          <span style={{ color: '#4A4A48', fontSize: 12 }}>
            Can&apos;t find it? Check your spam folder, or contact
            {' '}<a href="mailto:gwynnestarrs@gmail.com" style={{ color: '#8B6914', textDecoration: 'none' }}>support</a>.
          </span>
        </p>
      </div>
    </div>
  )
}
