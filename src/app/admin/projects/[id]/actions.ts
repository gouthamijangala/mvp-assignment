"use server";

import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { db } from "@/server/db";
import { requireOperator } from "@/server/auth";
import {
  PropertyStatus,
  ProjectStatus,
  FreelancerApplicationStatus,
  AssignmentStatus,
  ListingStatus,
} from "@prisma/client";

export async function approveProject(projectId: string) {
  await requireOperator();
  const proj = await db.project.findUnique({ where: { id: projectId }, select: { propertyId: true } });
  if (!proj) return;
  await db.$transaction([
    db.project.update({
      where: { id: projectId },
      data: { status: ProjectStatus.WAITING_FREELANCER },
    }),
    db.property.update({
      where: { id: proj.propertyId },
      data: { status: PropertyStatus.APPROVED },
    }),
  ]);
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function rejectProject(projectId: string) {
  await requireOperator();
  const proj = await db.project.findUnique({ where: { id: projectId }, select: { propertyId: true } });
  if (!proj) return;
  await db.$transaction([
    db.project.update({ where: { id: projectId }, data: { status: ProjectStatus.INTAKE } }),
    db.property.update({ where: { id: proj.propertyId }, data: { status: PropertyStatus.REJECTED } }),
  ]);
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function setProjectStatus(projectId: string, status: ProjectStatus) {
  await requireOperator();
  await db.project.update({ where: { id: projectId }, data: { status } });
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function updateProjectNotes(projectId: string, notes: string | null) {
  await requireOperator();
  await db.project.update({ where: { id: projectId }, data: { notes } });
  revalidatePath(`/admin/projects/${projectId}`);
}


export async function assignFreelancer(projectId: string, applicationId: string) {
  await requireOperator();
  const app = await db.freelancerApplication.findUnique({
    where: { id: applicationId },
    include: { project: true },
  });
  if (!app || app.projectId !== projectId) return;
  await db.$transaction([
    db.freelancerApplication.updateMany({
      where: { projectId },
      data: { status: FreelancerApplicationStatus.REJECTED },
    }),
    db.freelancerApplication.update({
      where: { id: applicationId },
      data: { status: FreelancerApplicationStatus.ACCEPTED },
    }),
    db.assignment.create({
      data: {
        projectId,
        freelancerId: app.freelancerId,
        status: AssignmentStatus.ASSIGNED,
      },
    }),
    db.project.update({
      where: { id: projectId },
      data: { status: ProjectStatus.ASSIGNED },
    }),
  ]);
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function saveListing(
  projectId: string,
  data: {
    title: string;
    description: string;
    nightlyRate: number;
    cleaningFee: number;
    maxGuests: number;
    slug: string;
  }
) {
  await requireOperator();
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { property: true },
  });
  if (!project) return;
  const existing = await db.listing.findUnique({ where: { propertyId: project.propertyId } });
  if (existing) {
    const updated = await db.listing.update({
      where: { id: existing.id },
      data: {
        title: data.title,
        description: data.description,
        nightlyRate: data.nightlyRate,
        cleaningFee: data.cleaningFee,
        maxGuests: data.maxGuests,
        slug: data.slug,
      },
    });
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath("/admin/projects");
    return updated.id;
  } else {
    const created = await db.listing.create({
      data: {
        propertyId: project.propertyId,
        slug: data.slug,
        title: data.title,
        description: data.description,
        nightlyRate: data.nightlyRate,
        cleaningFee: data.cleaningFee,
        maxGuests: data.maxGuests,
        status: ListingStatus.DRAFT,
      },
    });
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath("/admin/projects");
    return created.id;
  }
}

export async function publishListing(projectId: string) {
  await requireOperator();
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { property: { include: { listing: true } } },
  });
  const listing = project?.property?.listing;
  if (!listing) return;
  const now = new Date();
  await db.$transaction([
    db.listing.update({
      where: { id: listing.id },
      data: { status: ListingStatus.PUBLISHED, publishedAt: now },
    }),
    db.project.update({ where: { id: projectId }, data: { status: ProjectStatus.LISTED } }),
    db.property.update({
      where: { id: project!.propertyId },
      data: { status: PropertyStatus.LISTED },
    }),
  ]);
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function setProjectStatusFromForm(formData: FormData) {
  await requireOperator();
  const projectId = formData.get("projectId");
  const status = formData.get("status");
  if (typeof projectId !== "string" || typeof status !== "string") return;
  if (!Object.values(ProjectStatus).includes(status as ProjectStatus)) return;
  await db.project.update({ where: { id: projectId }, data: { status: status as ProjectStatus } });
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function updatePropertyFromForm(formData: FormData) {
  await requireOperator();
  const propertyId = formData.get("propertyId");
  if (typeof propertyId !== "string") return;
  const title = formData.get("title");
  const description = formData.get("description");
  const address = formData.get("address");
  const baseNightlyRate = formData.get("baseNightlyRate");
  const maxGuests = formData.get("maxGuests");
  await db.property.update({
    where: { id: propertyId },
    data: {
      ...(typeof title === "string" && { title }),
      ...(typeof description === "string" && { description }),
      ...(typeof address === "string" && { address }),
      ...(baseNightlyRate !== null && { baseNightlyRate: Number(baseNightlyRate) || undefined }),
      ...(maxGuests !== null && { maxGuests: Number(maxGuests) || undefined }),
    },
  });
  const proj = await db.project.findFirst({ where: { propertyId }, select: { id: true } });
  if (proj) revalidatePath(`/admin/projects/${proj.id}`);
  revalidatePath("/admin/projects");
}

export async function updateNotesFromForm(formData: FormData) {
  await requireOperator();
  const projectId = formData.get("projectId");
  const notes = formData.get("notes");
  if (typeof projectId !== "string") return;
  await db.project.update({
    where: { id: projectId },
    data: { notes: typeof notes === "string" ? notes || null : null },
  });
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function saveListingFromForm(formData: FormData) {
  await requireOperator();
  const projectId = formData.get("projectId");
  if (typeof projectId !== "string") return;
  const title = formData.get("listingTitle") as string;
  const description = formData.get("listingDescription") as string;
  const nightlyRate = Number(formData.get("nightlyRate"));
  const cleaningFee = Number(formData.get("cleaningFee"));
  const maxGuests = Number(formData.get("maxGuests"));
  const slug = ((formData.get("slug") as string) || "").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  if (!title || !slug) return;
  const listingId = await saveListing(projectId, {
    title,
    description: description ?? "",
    nightlyRate: nightlyRate || 0,
    cleaningFee: cleaningFee || 0,
    maxGuests: maxGuests || 1,
    slug,
  });

  // Optional guest-facing photos uploaded by operator
  const guestPhotos = formData.getAll("guestPhotos") as File[];
  const validPhotos = guestPhotos.filter((f) => f && f.size > 0);
  if (!listingId || validPhotos.length === 0) {
    return;
  }

  const totalSize = validPhotos.reduce((sum, f) => sum + f.size, 0);
  const fourMb = 4 * 1024 * 1024;
  if (totalSize > fourMb) {
    // Silently skip if too large; operators can try fewer/smaller images.
    return;
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];
  for (let i = 0; i < validPhotos.length; i++) {
    const file = validPhotos[i];
    const ext = path.extname(file.name) || ".jpg";
    const filename = `listing-${listingId}-guest-${i}${ext}`;
    const filepath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));
    urls.push(`/uploads/${filename}`);
  }

  await db.listing.update({
    where: { id: listingId },
    data: { guestPhotos: urls },
  });
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/admin/projects");
}
