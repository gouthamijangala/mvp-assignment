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
    return { error: "Failed to create account. Please try again." };
  }
}
