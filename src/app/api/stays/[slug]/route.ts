import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { ListingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const listing = await db.listing.findUnique({
    where: { slug, status: ListingStatus.PUBLISHED },
    include: { property: true },
  });

  if (!listing) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  const photos = (listing.property.photos as string[]) ?? [];

  const data = {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    description: listing.description,
    nightlyRate: listing.nightlyRate,
    cleaningFee: listing.cleaningFee,
    maxGuests: listing.maxGuests,
    currency: "usd",
    publishedAt: listing.publishedAt,
    photos,
    property: {
      id: listing.property.id,
      title: listing.property.title,
      address: listing.property.address,
      ownerName: listing.property.ownerName,
      ownerEmail: listing.property.ownerEmail,
    },
  };

  return NextResponse.json(data, {
    headers: CORS_HEADERS,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

