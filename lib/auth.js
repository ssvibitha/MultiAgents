import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const SESSION_COOKIE = "cartflow-session";

export const authOptions = {
  debug: false,

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = credentials.email?.trim().toLowerCase();
        const password = credentials.password;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });

        console.log("[authorize] Looking up email:", email, "=> found:", !!user);

        if (!user) throw new Error("No account found for this email");

        if (!user.password) {
          throw new Error("This account uses Google sign-in. Please sign in with Google.");
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Incorrect password");

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Upsert the Google user into our database
        try {
          await prisma.user.upsert({
            where: { email: profile.email },
            update: { name: profile.name },
            create: {
              email: profile.email,
              name: profile.name,
              // No password for Google users
            },
          });
        } catch (err) {
          console.error("Failed to upsert Google user:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google") {
        // Fetch the database user to get the consistent cuid
        const dbUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
        }
        token.picture = profile.picture;
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};