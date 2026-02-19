"use server";

import { db } from "@/server/db";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export type SignUpState = { error?: string; success?: boolean };

export async function signUpAction(formData: FormData): Promise<SignUpState> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const name = formData.get("name")?.toString().trim();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString();

  if (!email || !name || !password || !role) {
    return { error: "All fields are required." };
  }

  if (!["OWNER", "FREELANCER", "GUEST"].includes(role)) {
    return { error: "Invalid role selected." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists. Please sign in instead." };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role as Role,
      },
    });

    revalidatePath("/signin");
    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      const errorMessage = error.message;
      const errorCode = (error as any).code;

      // Check for Prisma errors
      if (errorCode === "P2002" || errorMessage.includes("Unique constraint")) {
        return { error: "An account with this email already exists. Please sign in instead." };
      }
      if (errorCode === "P1001" || errorMessage.includes("Can't reach database")) {
        return {
          error:
            "Cannot connect to database. Please check your DATABASE_URL environment variable and ensure your database is accessible.",
        };
      }
      if (
        errorMessage.includes("column") ||
        errorMessage.includes("Unknown column") ||
        errorMessage.includes("does not exist") ||
        errorCode === "P2021" ||
        errorCode === "P2010"
      ) {
        return {
          error:
            "Database migration required. Please run: npx prisma migrate dev (locally) " +
            "or ensure migrations are applied on your production database (Vercel/other hosting).",
        };
      }
      // Return the actual error message for debugging (in development)
      if (process.env.NODE_ENV === "development") {
        return { error: `Error: ${errorMessage} (Code: ${errorCode || "N/A"})` };
      }
    }

    return { error: "Failed to create account. Please try again." };
  }
}
