"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { z } from "zod";
import { db } from "@/server/db";
import { PropertyStatus } from "@prisma/client";
import { ProjectStatus } from "@prisma/client";

const ownerIntakeSchema = z.object({
  ownerName: z.string().min(1, "Name is required").max(200),
  ownerEmail: z.string().email("Invalid email"),
  title: z.string().min(1, "Property title is required").max(200),
  description: z.string().min(1, "Description is required").max(5000),
  address: z.string().min(1, "Address is required").max(500),
  baseNightlyRate: z.coerce.number().int().min(1, "Nightly rate must be at least 1"),
  maxGuests: z.coerce.number().int().min(1, "Max guests must be at least 1").max(50),
  consent: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms." }) }),
});

export type OwnerIntakeState = { error?: string; success?: boolean };

export async function submitOwnerIntake(
  _prev: OwnerIntakeState,
  formData: FormData
): Promise<OwnerIntakeState> {
  try {
    const raw = {
      ownerName: formData.get("ownerName"),
      ownerEmail: formData.get("ownerEmail"),
      title: formData.get("title"),
      description: formData.get("description"),
      address: formData.get("address"),
      baseNightlyRate: formData.get("baseNightlyRate"),
      maxGuests: formData.get("maxGuests"),
      consent: formData.get("consent") === "on",
    };

    const parsed = ownerIntakeSchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors;
      const msg = Object.values(first).flat().join(" ") || "Validation failed";
      return { error: msg };
    }

    const photos = formData.getAll("photos") as File[];
    if (!photos.length || (photos.length === 1 && photos[0].size === 0)) {
      return { error: "At least one photo is required." };
    }

    const validPhotos = photos.filter((f) => f.size > 0);
    if (validPhotos.length === 0) {
      return { error: "At least one photo is required." };
    }

    const totalSize = validPhotos.reduce((sum, f) => sum + f.size, 0);
    const fourMb = 4 * 1024 * 1024;
    if (totalSize > fourMb) {
      return { error: "Total photo size must be under 4MB. Try smaller or fewer images." };
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const photoUrls: string[] = [];
    const id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    for (let i = 0; i < validPhotos.length; i++) {
      const file = validPhotos[i];
      const ext = path.extname(file.name) || ".jpg";
      const filename = `${id}-${i}${ext}`;
      const filepath = path.join(uploadDir, filename);
      const bytes = await file.arrayBuffer();
      await writeFile(filepath, Buffer.from(bytes));
      photoUrls.push(`/uploads/${filename}`);
    }

    const { ownerName, ownerEmail, title, description, address, baseNightlyRate, maxGuests } =
      parsed.data;

    const property = await db.property.create({
      data: {
        ownerName,
        ownerEmail,
        title,
        description,
        address,
        photos: photoUrls,
        status: PropertyStatus.PENDING_REVIEW,
        baseNightlyRate,
        maxGuests,
      },
    });

    await db.project.create({
      data: {
        propertyId: property.id,
        status: ProjectStatus.INTAKE,
      },
    });

    revalidatePath("/admin/projects");
    return { success: true };
  } catch (e) {
    console.error("Owner intake error:", e);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Can't reach database server") || msg.includes("P1001")) {
      return { error: "Database is unavailable. Please try again later." };
    }
    return { error: "Failed to submit. Please try again." };
  }
}
