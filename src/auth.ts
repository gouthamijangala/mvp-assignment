import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const operatorEmail = process.env.OPERATOR_EMAIL ?? "";
const operatorPassword = process.env.OPERATOR_PASSWORD ?? "";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
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
        if (operatorEmail && email === operatorEmail && password === operatorPassword) {
          return { id: "operator", email, name: "Operator", role: "OPERATOR" };
        }
        return null;
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
