import Image from "next/image";
import Link from "next/link";
import { db } from "@/server/db";
import { ListingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse stays",
  description: "Find and book your next stay.",
};

export default async function BrowseStaysPage() {
  const listings = await db.listing.findMany({
    where: { status: ListingStatus.PUBLISHED },
    include: { property: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-white">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          <span className="hidden rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 sm:inline-flex">
            Guests · Discover live, operator‑approved stays
          </span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Browse stays</h1>
            <p className="mt-3 text-lg text-slate-600">
              Handpicked properties that have been reviewed by operators, with clear INR pricing for every night.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 max-w-sm">
            These stays come from owners who submitted their homes on the platform. Operators approve each property
            and publish it here once it is guest‑ready.
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">No stays available yet</h2>
            <p className="mt-2 text-base text-slate-600 max-w-md mx-auto">
              New stays will appear here once they're published. Check back soon for exciting properties.
            </p>
            <Link href="/" className="mt-6 inline-flex items-center btn-secondary">
              Back to Home
            </Link>
          </div>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => {
              const photos = (listing.property.photos as string[]) ?? [];
              const imageUrl = photos[0] ?? null;
              return (
                <li key={listing.id}>
                  <Link
                    href={`/stays/${listing.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt=""
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm bg-slate-100">
                          No image
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="text-lg font-bold text-slate-900 line-clamp-1">{listing.title}</h2>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        ₹{listing.nightlyRate.toLocaleString("en-IN")}
                        <span className="text-sm font-normal text-slate-600"> / night</span>
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Up to {listing.maxGuests} {listing.maxGuests === 1 ? 'guest' : 'guests'}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
