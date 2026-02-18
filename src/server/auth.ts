import { auth } from "@/auth";

export type OperatorSession = Awaited<ReturnType<typeof getOperatorSession>>;

/**
 * Use in server actions and server components that must be operator-only.
 * Throws if not authenticated or not operator; returns session otherwise.
 */
export async function requireOperator() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: sign in required");
  }
  const role = (session.user as { role?: string }).role;
  if (role !== "OPERATOR") {
    throw new Error("Forbidden: operator access required");
  }
  return session;
}

/**
 * Optional: get session only if operator; returns null otherwise.
 */
export async function getOperatorSession() {
  const session = await auth();
  if (!session?.user) return null;
  const role = (session.user as { role?: string }).role;
  if (role !== "OPERATOR") return null;
  return session;
}
