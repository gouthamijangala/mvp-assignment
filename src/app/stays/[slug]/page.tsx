import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { ListingStatus } from "@prisma/client";
import { BookingForm } from "./booking-form";

export const dynamic = "force-dynamic";

export default async function StayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await db.listing.findUnique({
    where: { slug, status: ListingStatus.PUBLISHED },
    include: { property: true },
  });

  if (!listing) notFound();

  const guestPhotos = (listing.guestPhotos as string[] | null) ?? [];
  const basePhotos = (listing.property.photos as string[]) ?? [];
  const photos = guestPhotos.length > 0 ? guestPhotos : basePhotos;
  const heroPhoto = photos[0] ?? null;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 flex flex-wrap items-center gap-3">
          <Link href="/stays" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Browse stays
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Home
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{listing.title}</h1>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
          <span className="font-medium text-slate-700">${listing.nightlyRate}</span>
          <span>/ night</span>
          <span>·</span>
          <span>Cleaning fee ${listing.cleaningFee}</span>
          <span>·</span>
          <span>Up to {listing.maxGuests} guests</span>
        </div>

        {heroPhoto && (
          <div className="relative mt-6 w-full aspect-[16/10] overflow-hidden rounded-xl bg-slate-200">
            <Image
              src={heroPhoto}
              alt=""
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}
        {photos.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {photos.slice(1, 5).map((url, i) => (
              <div
                key={i}
                className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200"
              >
                <Image src={url} alt="" fill className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">About this stay</h2>
            <p className="mt-2 text-slate-700 whitespace-pre-wrap">{listing.description}</p>
          </div>
          <div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <BookingForm
                listingId={listing.id}
                nightlyRate={listing.nightlyRate}
                cleaningFee={listing.cleaningFee}
                maxGuests={listing.maxGuests}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
