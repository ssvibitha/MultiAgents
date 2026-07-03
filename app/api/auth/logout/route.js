import { NextResponse } from "next/server";

// NextAuth handles sign-out via its own /api/auth/signout endpoint.
// This custom route is kept as a convenience wrapper but now also
// clears the NextAuth session cookie for a clean logout.
export async function POST() {
  const res = NextResponse.json({ ok: true });

  // Clear NextAuth's session cookies
  res.cookies.set("next-auth.session-token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  res.cookies.set("next-auth.csrf-token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  // Also clear the legacy custom cookie in case it still exists
  res.cookies.set("cartflow-session", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
