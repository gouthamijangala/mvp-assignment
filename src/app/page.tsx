import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Turn your rental into a bookable stay
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Submit your property, get it set up, and start welcoming guests.
          </p>
        </div>
      </header>

      {/* Who are you? */}
      <section className="mx-auto max-w-2xl px-4 py-10">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-wide text-slate-500">
          I am a…
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          <li>
            <Link
              href="/owner/submit"
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow"
            >
              <span className="text-lg font-semibold text-slate-900">Property owner</span>
              <span className="mt-1 text-sm text-slate-600">
                Submit your property for review. We’ll help you list it and get bookings.
              </span>
              <span className="mt-3 text-sm font-medium text-slate-700">Submit property →</span>
            </Link>
          </li>
          <li>
            <Link
              href="/freelancer/projects"
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow"
            >
              <span className="text-lg font-semibold text-slate-900">Freelancer</span>
              <span className="mt-1 text-sm text-slate-600">
                Browse open projects and apply. Get assigned to set up properties for listing.
              </span>
              <span className="mt-3 text-sm font-medium text-slate-700">View projects →</span>
            </Link>
          </li>
        </ul>
      </section>

      {/* Operator & Browse */}
      <section className="mx-auto max-w-2xl px-4 pb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-center">
          <Link
            href="/admin/signin"
            className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-center shadow-sm transition hover:border-slate-300 hover:shadow"
          >
            <span className="text-sm font-medium text-slate-500">Staff</span>
            <p className="mt-1 font-semibold text-slate-900">Operator login</p>
            <p className="mt-0.5 text-xs text-slate-600">Review projects, assign freelancers, publish listings</p>
          </Link>
          <Link
            href="/stays"
            className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-center shadow-sm transition hover:border-slate-300 hover:shadow"
          >
            <span className="text-sm font-medium text-slate-500">Guests</span>
            <p className="mt-1 font-semibold text-slate-900">Browse stays</p>
            <p className="mt-0.5 text-xs text-slate-600">
              Find and book published stays. New listings appear as operators publish them.
            </p>
            <span className="mt-2 inline-block text-sm font-medium text-slate-700">View all stays →</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-6">
        <p className="text-center text-xs text-slate-500">
          Property Ops · Turn rentals into bookable listings
        </p>
      </footer>
    </main>
  );
}
