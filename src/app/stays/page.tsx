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
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Back to home
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">Browse stays</h1>
        <p className="mt-1 text-slate-600 text-sm">
          Choose a stay and book your dates.
        </p>

        {listings.length === 0 ? (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="font-medium text-slate-900">No stays available yet</p>
            <p className="mt-1 text-sm text-slate-600">
              New stays will appear here once they’re published. Check back soon.
            </p>
            <Link href="/" className="mt-4 inline-block text-sm font-medium text-slate-700 hover:text-slate-900">
              Back to home
            </Link>
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => {
              const photos = (listing.property.photos as string[]) ?? [];
              const imageUrl = photos[0] ?? null;
              return (
                <li key={listing.id}>
                  <Link
                    href={`/stays/${listing.slug}`}
                    className="block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow"
                  >
                    <div className="relative aspect-[4/3] bg-slate-200">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                          No image
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="font-semibold text-slate-900">{listing.title}</h2>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        ${listing.nightlyRate} <span className="font-normal text-slate-500">/ night</span>
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Up to {listing.maxGuests} guests
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
