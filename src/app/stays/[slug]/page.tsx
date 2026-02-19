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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap items-center gap-3">
          <Link href="/stays" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Browse stays
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Home
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{listing.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-base">
            <span className="text-2xl font-bold text-slate-900">
              ₹{listing.nightlyRate.toLocaleString("en-IN")}
            </span>
            <span className="text-slate-600">/ night</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600">
              Cleaning fee:{" "}
              <span className="font-semibold text-slate-900">
                ₹{listing.cleaningFee.toLocaleString("en-IN")}
              </span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600">
              Up to <span className="font-semibold text-slate-900">{listing.maxGuests}</span>{" "}
              {listing.maxGuests === 1 ? "guest" : "guests"}
            </span>
          </div>
        </div>

        {heroPhoto && (
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-slate-200 shadow-lg">
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
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {photos.slice(1, 5).map((url, i) => (
              <div
                key={i}
                className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-200"
              >
                <Image src={url} alt="" fill className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About this stay</h2>
              <p className="text-slate-700 leading-7 whitespace-pre-wrap">{listing.description}</p>
            </div>
          </div>
          <div>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
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
