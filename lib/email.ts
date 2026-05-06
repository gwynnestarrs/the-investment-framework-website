import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendSetPasswordEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL
  const link = `${baseUrl}/set-password?token=${token}`
  const from = process.env.EMAIL_FROM || 'noreply@yourdomain.com'

  await resend.emails.send({
    from: `The Investment Framework <${from}>`,
    to: email,
    subject: 'Welcome to The Investment Framework — Set Your Password',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0" style="background:#0F0F0F;border:1px solid #1E1E1E;max-width:540px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 32px;text-align:center;border-bottom:1px solid #1E1E1E;">
              <div style="display:inline-block;width:44px;height:44px;border:1px solid #C9A84C;text-align:center;line-height:44px;margin-bottom:24px;">
                <span style="color:#C9A84C;font-size:13px;font-weight:700;letter-spacing:0.1em;">IF</span>
              </div>
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:400;color:#F0EDE6;font-family:Georgia,'Times New Roman',serif;">
                Welcome to The Investment Framework
              </h1>
              <p style="margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#4A4A48;">
                Your purchase was successful
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 24px;font-size:14px;color:#8A8880;line-height:1.75;">
                You now have full access to all 10 modules of The Investment Framework —
                the same analytical lens used by professional fund managers, applied to
                your personal investing journey.
              </p>
              <p style="margin:0 0 36px;font-size:14px;color:#8A8880;line-height:1.75;">
                Click the button below to set your password and access your course portal.
                This link expires in <strong style="color:#F0EDE6;">24 hours</strong> and
                can only be used once.
              </p>

              <!-- CTA Button -->
              <div style="text-align:center;margin:0 0 36px;">
                <a href="${link}"
                   style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#E8D08A);
                          color:#080808;text-decoration:none;font-size:11px;font-weight:700;
                          letter-spacing:0.18em;text-transform:uppercase;padding:16px 44px;">
                  Set Your Password →
                </a>
              </div>

              <!-- Fallback link -->
              <p style="margin:0;font-size:11px;color:#3A3A38;text-align:center;line-height:1.6;">
                If the button doesn't work, copy and paste this link:<br>
                <a href="${link}" style="color:#8B6914;word-break:break-all;">${link}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #1E1E1E;text-align:center;">
              <p style="margin:0;font-size:11px;color:#3A3A38;line-height:1.6;">
                If you didn't purchase this course, you can safely ignore this email.<br>
                © 2026 The Investment Framework. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  })
}
