import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/login' },
    })
  }

  let html = readFileSync(join(process.cwd(), 'course.html'), 'utf-8')

  // Auto-bypass the internal password gate — auth is now handled by Next.js middleware
  html = html.replace(
    '</head>',
    `<script>sessionStorage.setItem('tif_auth','1');</script></head>`,
  )

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
    },
  })
}
