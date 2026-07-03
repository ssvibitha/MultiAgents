import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/wishlist", "/account"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some(
    (p) => pathname === p || pathname.startsWith(p)
  );

  if (!isProtected) return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/wishlist/:path*", "/account/:path*"],
};