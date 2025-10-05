import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isHomePage = request.nextUrl.pathname === "/";
  const isHomeRoute = request.nextUrl.pathname.startsWith("/home");

  if (isHomePage) {
    if (token) {
      return NextResponse.redirect(new URL("/home", request.url));
    } else {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (isHomeRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
