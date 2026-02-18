import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { ListingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
  const listings = await db.listing.findMany({
    where: { status: ListingStatus.PUBLISHED },
    include: { property: true },
    orderBy: { publishedAt: "desc" },
  });

  const data = listings.map((listing) => {
    const photos = (listing.property.photos as string[]) ?? [];
    return {
      id: listing.id,
      slug: listing.slug,
      title: listing.title,
      description: listing.description,
      nightlyRate: listing.nightlyRate,
      cleaningFee: listing.cleaningFee,
      maxGuests: listing.maxGuests,
      currency: "usd",
      publishedAt: listing.publishedAt,
      heroImage: photos[0] ?? null,
      property: {
        id: listing.property.id,
        title: listing.property.title,
        address: listing.property.address,
      },
    };
  });

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

