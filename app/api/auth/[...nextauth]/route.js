import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Wrap the handler to catch errors and always return JSON
// This prevents the CLIENT_FETCH_ERROR on Next.js 16 where
// an unhandled error returns an HTML error page instead of JSON
async function safeHandler(req, ctx) {
  try {
    return await handler(req, ctx);
  } catch (error) {
    console.error("[next-auth] Route handler error:", error);
    return Response.json(
      { error: "Internal auth error" },
      { status: 500 }
    );
  }
}

export { safeHandler as GET, safeHandler as POST };