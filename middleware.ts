import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Your middleware logic can go here in the future
  return NextResponse.next()
}

// This is the crucial part: it tells the middleware to IGNORE all paths starting with `.swa`
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT for the ones starting with:
     * - .swa (Azure Static Web Apps health check)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!.swa|_next/static|_next/image|favicon.ico).*)',
  ],
}