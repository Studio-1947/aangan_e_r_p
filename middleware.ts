export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - assets (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|assets|favicon.ico).*)',
  ],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Allow these paths without authentication
  const publicPaths = ['/api/gatekeeper', '/_next', '/assets', '/favicon.ico', '/index.html'];
  
  // Skip public paths and files with extensions (assets)
  if (publicPaths.some(path => pathname.startsWith(path)) || pathname.includes('.')) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }

  // Parse Cookie header manually for non-Next environments
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => {
    const [key, ...value] = c.split('=');
    return [key?.trim(), value.join('=')];
  }));
  
  const gateCookie = cookies['lokmap_gate'];
  const masterPass = (process.env as any).GATE_PASS || 'aangan2024';

  if (gateCookie === masterPass) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }

  // For SPAs, we allow the request but the client app handles the UI gate.
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}
