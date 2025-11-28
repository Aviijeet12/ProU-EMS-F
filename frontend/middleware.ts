import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("proums_token")?.value || null;
  const role = req.cookies.get("proums_role")?.value || null;

  const { pathname } = req.nextUrl;

  // Public routes: no login required
  const publicRoutes = ["/login", "/register"];
  if (publicRoutes.includes(pathname)) {
    // If logged in, redirect to correct dashboard
    if (token && role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    if (token && role === "user") {
      return NextResponse.redirect(new URL("/employee/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // If not logged in → redirect to login
  if (!token || !role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ADMIN ROUTES PROTECTION
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/employee/dashboard", req.url));
    }
  }

  // EMPLOYEE ROUTES PROTECTION
  if (pathname.startsWith("/employee")) {
    if (role !== "user") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // Default allow
  return NextResponse.next();
}

// Middleware paths matcher
export const config = {
  matcher: [
    "/admin/:path*",
    "/employee/:path*",
    "/login",
    "/register"
  ]
};
