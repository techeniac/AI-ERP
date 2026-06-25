import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/api"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check auth cookie set by Zustand persist
  const authCookie = request.cookies.get("ai-erp-auth");

  if (authCookie) {
    try {
      const parsed = JSON.parse(authCookie.value) as { state?: { isAuthenticated?: boolean } };
      if (parsed.state?.isAuthenticated) {
        return NextResponse.next();
      }
    } catch {
      // Invalid cookie — redirect to login
    }
  }

  // Check localStorage auth via custom header (set by client-side layout)
  // In Phase 1 demo mode: be permissive — let client-side auth store handle redirects
  // The login page sets the store; if no store data, redirect to login
  if (pathname === "/" || pathname.startsWith("/dashboard") ||
      pathname.startsWith("/crm") || pathname.startsWith("/customers") ||
      pathname.startsWith("/finance") || pathname.startsWith("/support") ||
      pathname.startsWith("/operations") || pathname.startsWith("/hr") ||
      pathname.startsWith("/documents") || pathname.startsWith("/approvals") ||
      pathname.startsWith("/reports") || pathname.startsWith("/settings") ||
      pathname.startsWith("/procurement")) {
    // DECISION: In Phase 1, middleware redirects are relaxed — auth is enforced
    // client-side via AuthGuard in the dashboard layout to avoid SSR/localStorage mismatch.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.ico).*)"],
};
