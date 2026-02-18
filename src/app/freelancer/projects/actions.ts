"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/server/db";
import { Role, FreelancerProfileStatus } from "@prisma/client";
import { ProjectStatus } from "@prisma/client";

const applySchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email"),
  message: z.string().max(2000).optional(),
});

export type ApplyState = { error?: string; success?: boolean };

export async function applyToProject(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const raw = {
    projectId: formData.get("projectId"),
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };
  const parsed = applySchema.safeParse(raw);
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors).flat().join(" ") || "Invalid input";
    return { error: msg };
  }

  const { projectId, name, email, message } = parsed.data;
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { id: true, status: true },
  });
  if (!project || project.status !== ProjectStatus.WAITING_FREELANCER) {
    return { error: "Project is not open for applications." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    user = await db.user.create({
      data: {
        email: normalizedEmail,
        name,
        role: Role.FREELANCER,
      },
    });
  }

  let profile = await db.freelancerProfile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    profile = await db.freelancerProfile.create({
      data: {
        userId: user.id,
        bio: null,
        skills: [],
        regions: [],
        status: FreelancerProfileStatus.ACTIVE,
      },
    });
  }

  const existing = await db.freelancerApplication.findFirst({
    where: { projectId, freelancerId: profile.id },
  });
  if (existing) {
    return { error: "You have already applied to this project." };
  }

  await db.freelancerApplication.create({
    data: {
      projectId,
      freelancerId: profile.id,
      message: message ?? null,
    },
  });

  revalidatePath("/freelancer/projects");
  revalidatePath(`/admin/projects/${projectId}`);
  return { success: true };
}
