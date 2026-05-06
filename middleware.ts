import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/course') {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', '/course')
      return NextResponse.redirect(loginUrl)
    }
    // Rewrite to the route handler that serves course.html
    return NextResponse.rewrite(new URL('/api/serve-course', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/course'],
}
