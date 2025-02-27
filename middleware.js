import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export function middleware(request) {
  // Handle root docs path
  const { pathname } = request.nextUrl;
  if (pathname === "/docs" || pathname === "/docs/") {
    return NextResponse.redirect(new URL("/docs/introduction", request.url));
  }
  return NextResponse.next();
}

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => !!token,
  },
});

export const config = {
  matcher: ["/docs", "/docs/", "/dashboard/:path*"],
};
