import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";

const operatorEmail = process.env.OPERATOR_EMAIL ?? "";
const operatorPassword = process.env.OPERATOR_PASSWORD ?? "";

// #region agent log
const nextAuthSecretRaw = process.env.NEXTAUTH_SECRET;
const authSecretRaw = process.env.AUTH_SECRET;
const computedSecret = nextAuthSecretRaw || authSecretRaw;
const allEnvKeys = Object.keys(process.env);
const customEnvKeys = allEnvKeys.filter(k => !k.startsWith('VERCEL_') && !k.startsWith('NEXT_') && !k.startsWith('NODE_'));
const debugData = {
  sessionId: '673c5e',
  location: 'src/auth.ts:8',
  message: 'Auth secret env vars check',
  data: {
    hasNextAuthSecret: !!nextAuthSecretRaw,
    nextAuthSecretLength: nextAuthSecretRaw?.length || 0,
    hasAuthSecret: !!authSecretRaw,
    authSecretLength: authSecretRaw?.length || 0,
    computedSecretLength: computedSecret?.length || 0,
    computedSecretIsUndefined: computedSecret === undefined,
    computedSecretIsEmpty: computedSecret === '',
    nodeEnv: process.env.NODE_ENV,
    totalEnvKeys: allEnvKeys.length,
    customEnvKeys: customEnvKeys.join(','),
    allEnvKeys: allEnvKeys.join(','),
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL
  },
  timestamp: Date.now(),
  runId: 'vercel',
  hypothesisId: 'A,B,C,D'
};
console.error('[DEBUG] Auth secret check:', JSON.stringify(debugData, null, 2));
fetch('http://127.0.0.1:7823/ingest/84337e17-207d-4a10-b493-89d4fd5491b2',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'673c5e'},body:JSON.stringify(debugData)}).catch(()=>{});
// #endregion

// Provide a fallback secret in production if env vars are missing (for debugging)
// This should NOT be used in real production - it's only to help diagnose the issue
const finalSecret = computedSecret || (process.env.NODE_ENV === 'production' ? undefined : 'dev-fallback-secret-not-for-production');

// #region agent log
console.error('[DEBUG] NextAuth init - secret value:', {
  hasSecret: !!computedSecret,
  secretLength: computedSecret?.length || 0,
  secretType: typeof computedSecret,
  secretIsUndefined: computedSecret === undefined,
  secretIsNull: computedSecret === null,
  secretIsEmptyString: computedSecret === '',
  secretPreview: computedSecret ? `${computedSecret.substring(0, 4)}...${computedSecret.substring(computedSecret.length - 4)}` : 'N/A'
});
// #endregion

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

        // Check database users
        try {
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
