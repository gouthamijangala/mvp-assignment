import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;
  if (!bookingId) notFound();

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { listing: { include: { property: true } } },
  });

  if (!booking) notFound();

  const checkIn = new Date(booking.checkIn).toLocaleDateString();
  const checkOut = new Date(booking.checkOut).toLocaleDateString();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-4 text-xl font-semibold text-slate-900 text-center">Booking confirmed</h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          We’ve received your booking. Details will be sent to <strong>{booking.guestEmail}</strong>.
        </p>
        <dl className="mt-6 space-y-3 border-t border-slate-200 pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Property</dt>
            <dd className="font-medium text-slate-900">{booking.listing.title}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Check-in</dt>
            <dd className="text-slate-900">{checkIn}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Check-out</dt>
            <dd className="text-slate-900">{checkOut}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Total</dt>
            <dd className="font-medium text-slate-900">
              ${(booking.totalAmount / 100).toFixed(2)} {booking.currency.toUpperCase()}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-slate-500">
          Instructions and access details will be sent to your email before check-in.
        </p>
        <Link
          href="/"
          className="mt-6 block w-full rounded-lg border border-slate-300 bg-white py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
