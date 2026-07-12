import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect all routes nested inside /admin/dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    const token = request.cookies.get('admin_session')?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await decryptSession(token);
    if (!payload || payload.email !== process.env.ADMIN_EMAIL && payload.email !== "anupadmin123***@gmail.com") {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('unauthorized', 'true');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('admin_session');
      return response;
    }
  }

  // Prevent logged-in admin from accessing login screen
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_session')?.value;
    if (token) {
      const payload = await decryptSession(token);
      if (payload) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
