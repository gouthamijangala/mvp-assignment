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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 text-center">Booking Confirmed!</h1>
        <p className="mt-3 text-center text-base text-slate-600">
          We've received your booking. Confirmation details will be sent to <strong className="text-slate-900">{booking.guestEmail}</strong>.
        </p>
        <div className="mt-8 rounded-xl bg-slate-50 border border-slate-200 p-6">
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <dt className="text-slate-600 font-medium">Property</dt>
              <dd className="font-bold text-slate-900 text-right">{booking.listing.title}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-slate-600 font-medium">Check-in</dt>
              <dd className="text-slate-900 font-semibold">{checkIn}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-slate-600 font-medium">Check-out</dt>
              <dd className="text-slate-900 font-semibold">{checkOut}</dd>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <dt className="text-base font-bold text-slate-900">Total</dt>
              <dd className="text-lg font-bold text-slate-900">
                ${(booking.totalAmount / 100).toFixed(2)} {booking.currency.toUpperCase()}
              </dd>
            </div>
          </dl>
        </div>
        <p className="mt-6 text-sm text-slate-600 text-center">
          Instructions and access details will be sent to your email before check-in.
        </p>
        <Link
          href="/"
          className="mt-8 block w-full btn-secondary py-3"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
