import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  const isAdmin = token?.role === 'ADMIN'
  const isStudent = token?.role === 'STUDENT'

  // Admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
  }

  // Protected app routes (student routes)
  if (req.nextUrl.pathname.startsWith('/learn') || req.nextUrl.pathname.startsWith('/my-learning')) {
    if (!isStudent && !isAdmin) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/learn/:path*',
    '/my-learning/:path*',
    '/api/protected/:path*'
  ]
}
