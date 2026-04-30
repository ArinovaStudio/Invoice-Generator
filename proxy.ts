// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isLoggedIn = !!token;

  const { nextUrl } = req;
  const isProtectedRoute = nextUrl.pathname.startsWith("/user");
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/user", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/login", "/register", "/invoice"],
};