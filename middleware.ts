import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow these paths without authentication
  const publicPaths = ['/api/gatekeeper', '/_next', '/assets', '/favicon.ico', '/index.html'];
  
  // In Vite, we don't usually have a separate /login.html, it's all handled by App.tsx.
  // But we want to allow the SPA to load so it can show its own login page if it handles the gate.
  // HOWEVER, for "gatekeeping" we usually want to block the bundle itself.
  
  // For now, let's allow everything to reach the client, but the client will show the gate.
  // Actually, to be "Pro Secure" like lok-map, we should block the main page.
  
  // Check for the gatekeeper cookie
  const gateCookie = request.cookies.get('lokmap_gate');
  const masterPass = process.env.GATE_PASS || 'aangan2024';

  if (gateCookie?.value === masterPass) {
    return NextResponse.next();
  }

  // If we are already on a "public" looking path or an asset, allow it
  if (publicPaths.some(path => pathname.startsWith(path)) || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Otherwise, we allow the request to proceed but the App.tsx must handle the UI gate.
  // In a Vite SPA, if we redirect to /login, the SPA must have a /login route.
  return NextResponse.next();
}
