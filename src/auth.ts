import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const operatorEmail = process.env.OPERATOR_EMAIL ?? "";
const operatorPassword = process.env.OPERATOR_PASSWORD ?? "";

const nextAuthSecretRaw = process.env.NEXTAUTH_SECRET;
const authSecretRaw = process.env.AUTH_SECRET;
const computedSecret = nextAuthSecretRaw || authSecretRaw;

// Provide a fallback secret in production if env vars are missing (for debugging)
// This should NOT be used in real production - it's only to help diagnose the issue
const finalSecret = computedSecret || (process.env.NODE_ENV === 'production' ? undefined : 'dev-fallback-secret-not-for-production');

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: finalSecret,
  providers: [
    Credentials({
      name: "Operator",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        // Check operator credentials first (from env vars)
        if (operatorEmail && email === operatorEmail && password === operatorPassword) {
          return { id: "operator", email, name: "Operator", role: "OPERATOR" };
        }

        // Check database users (lazy import to avoid bundling Prisma/bcrypt in Edge Runtime)
        try {
          // Dynamic import to keep Edge Function size small - only loads when actually authenticating
          const { db } = await import("@/server/db");
          const bcrypt = await import("bcryptjs");
          
          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            return null; // User doesn't exist or has no password (legacy account)
          }

          // Verify password
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
    authorized({ request, auth: session }) {
      const { pathname } = request.nextUrl;
      const isSignInPage =
        pathname.startsWith("/admin/signin") || pathname.startsWith("/admin/login");
      if (pathname.startsWith("/admin") && !isSignInPage) {
        return !!session?.user;
      }
      return true;
    },
  },
  pages: {
    signIn: "/admin/signin",
  },
});
