import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifyAuthSession } from "@/lib/auth";

const publicPaths = new Set(["/login", "/forbidden", "/"]);

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/api/auth") || pathname === "/api/health") {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    // Allow unauthenticated access to public storefront routes
    if (
      publicPaths.has(pathname) ||
      pathname === "/products" ||
      pathname.startsWith("/products/") ||
      pathname === "/cart" ||
      pathname === "/checkout"
    ) {
      return NextResponse.next();
    }

    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", `${pathname}${search}`);
    }

    return NextResponse.redirect(loginUrl);
  }

  let session;

  try {
    session = await verifyAuthSession(token);
  } catch {
    // Token failed verification — treat as anonymous for public routes,
    // otherwise redirect to login and clear cookie.
    const response = NextResponse.next();
    response.cookies.delete(AUTH_COOKIE_NAME);

    if (
      publicPaths.has(pathname) ||
      pathname === "/products" ||
      pathname.startsWith("/products/") ||
      pathname === "/cart" ||
      pathname === "/checkout"
    ) {
      return response;
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/admin") && session.role === "user") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|.*\\.[^/]+$).*)"],
};
