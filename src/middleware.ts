import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of public routes that don't require authentication
const publicRoutes = [
  "/auth/signin", 
  "/auth/signup", 
  "/auth/forgot-password"
];

// List of auth routes that should redirect to dashboard if user is already authenticated
const authRoutes = ["/auth/signin", "/auth/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the token from cookies (you'll implement the actual token logic later)
  // const token = request.cookies.get("auth-token");
  // const isAuthenticated = !!token;

  // // Check if the current route is a public route
  // const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  
  // // Check if the current route is an auth route
  // const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  
  // // If user is not authenticated and trying to access a protected route
  // if (!isAuthenticated && !isPublicRoute) {
  //   const signinUrl = new URL("/auth/signin", request.url);
  //   // Add the original URL as a redirect parameter
  //   signinUrl.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(signinUrl);
  // }
  
  // // If user is authenticated and trying to access auth routes, redirect to dashboard
  // if (isAuthenticated && isAuthRoute) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }
  
  // // For the root path, redirect based on authentication status
  // if (pathname === "/") {
  //   if (isAuthenticated) {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   } else {
  //     return NextResponse.redirect(new URL("/auth/signin", request.url));
  //   }
  // }
  
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
