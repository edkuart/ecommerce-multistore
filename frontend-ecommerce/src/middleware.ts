import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "seller_token";
const LOGIN_PATH = "/dashboard/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isDashboardApi = pathname.startsWith("/api/dashboard");
  const isLoginPage = pathname === LOGIN_PATH;
  const isAuthApi = pathname.startsWith("/api/dashboard/auth");

  if ((!isDashboard && !isDashboardApi) || isLoginPage || isAuthApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    if (isDashboardApi) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/dashboard/:path*"],
};
