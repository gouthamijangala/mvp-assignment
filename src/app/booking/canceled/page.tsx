import Link from "next/link";

export default function BookingCanceledPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">Booking canceled</h1>
        <p className="mt-2 text-sm text-slate-600">
          You canceled checkout. No charge was made.
        </p>
        <Link
          href="/"
          className="mt-6 block w-full rounded-lg bg-slate-800 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-700"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
