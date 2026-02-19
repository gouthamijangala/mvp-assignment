import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow sign-in pages
  if (pathname.startsWith("/admin/signin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Check for admin routes
  if (pathname.startsWith("/admin")) {
    // Check for NextAuth session cookie (NextAuth v5 uses 'authjs.session-token' or similar)
    const sessionToken = 
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    // If no session token, redirect to sign-in
    if (!sessionToken) {
      const signInUrl = new URL("/admin/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
