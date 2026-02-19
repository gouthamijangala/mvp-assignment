import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-emerald-50 to-white">
      {/* Header with Sign In */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold text-slate-900">
            Property Ops
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400"
            >
              Sign Up
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Sign In
            </Link>
          </div>
        </div>
      </div>
      {/* Hero Section – Motive */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-sky-500 via-indigo-500 to-emerald-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
              End‑to‑end property ops · Owners · Freelancers · Operators · Guests
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Turn Indian rentals into
              <span className="block text-amber-200">Airbnb‑style bookable stays</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-sky-50 sm:text-xl">
              Property Ops is a single workspace to move a home from{" "}
              <span className="font-semibold">owner submission → freelancer setup → operator approval → guest booking</span>{" "}
              without WhatsApp chaos or manual follow‑ups.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/owner/submit" className="btn-primary bg-white text-slate-900 hover:bg-slate-100">
                List your property in minutes
              </Link>
              <Link href="/stays" className="btn-secondary border-white/70 text-white hover:bg-white/10">
                Browse live stays
              </Link>
            </div>
            <p className="mt-6 text-sm text-sky-50/90">
              Owners submit once. Operators see every project in one dashboard. Freelancers get clear briefs. Guests see
              polished, trustworthy listings.
            </p>
          </div>
        </div>
      </section>

      {/* Product Overview – What you get */}
      <section className="border-b border-slate-200 bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              One platform for the entire property journey
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">
              This MVP focuses on the real workflows you run today: collecting details from owners, assigning freelancers,
              publishing listings, and letting guests book with confidence.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Owners</p>
              <h3 className="mt-2 text-base font-semibold text-slate-900">Guided intake form</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Owners share property details, photos, and expected INR rate once. No back‑and‑forth spreadsheets.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Freelancers</p>
              <h3 className="mt-2 text-base font-semibold text-slate-900">Project marketplace</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Freelancers see open projects, apply with context, and get confirmed assignments from operators.
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Operators</p>
              <h3 className="mt-2 text-base font-semibold text-slate-900">Control dashboard</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Approve owner submissions, create guest‑ready listings, upload new guest photos, and publish in one place.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Guests</p>
              <h3 className="mt-2 text-base font-semibold text-slate-900">Simple booking flow</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Guests browse stays, see transparent INR pricing, pick dates, and receive confirmations after booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How the workflow runs end‑to‑end
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              This MVP is built to validate the full journey from owner to guest, with operators in control of every step.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
                1
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Owner Submits</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Property owners submit their rental details and photos. Simple one-time intake process.
              </p>
            </div>
            {/* Step 2 */}
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500 text-lg font-bold text-white">
                2
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Operator Reviews</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Our team reviews submissions, approves properties, and matches them with qualified freelancers.
              </p>
            </div>
            {/* Step 3 */}
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold text-white">
                3
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Freelancer Sets Up</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Assigned freelancers prepare the property, optimize photos, and create compelling listings.
              </p>
            </div>
            {/* Step 4 */}
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-lg font-bold text-white">
                4
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Guests Book</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Published listings go live. Guests browse, book, and pay securely. Automated confirmations sent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Entry Points */}
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Get Started
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Choose your role to access the right tools and workflows
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Property Owner */}
            <Link
              href="/owner/submit"
              className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/80 p-8 shadow-sm transition-all hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="absolute right-4 top-4 opacity-10 transition-opacity group-hover:opacity-20">
                <svg className="h-16 w-16 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="relative">
                <h3 className="text-xl font-bold text-slate-900">Property Owner</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Share your property details, photos, and INR pricing once. We convert it into a guest‑ready stay.
                </p>
                <div className="mt-6 flex items-center text-sm font-semibold text-slate-900 group-hover:text-slate-700">
                  Submit Property
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Freelancer */}
            <Link
              href="/freelancer/projects"
              className="group relative overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/80 p-8 shadow-sm transition-all hover:border-sky-200 hover:shadow-lg"
            >
              <div className="absolute right-4 top-4 opacity-10 transition-opacity group-hover:opacity-20">
                <svg className="h-16 w-16 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="relative">
                <h3 className="text-xl font-bold text-slate-900">Freelancer</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Discover projects that need styling, photography, or setup help and apply directly inside the product.
                </p>
                <div className="mt-6 flex items-center text-sm font-semibold text-slate-900 group-hover:text-slate-700">
                  View Projects
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Operator */}
            <Link
              href="/admin/signin"
              className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50/80 p-8 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="absolute right-4 top-4 opacity-10 transition-opacity group-hover:opacity-20">
                <svg className="h-16 w-16 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="relative">
                <h3 className="text-xl font-bold text-slate-900">Operator</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  See every property as a project, track status, assign freelancers, and publish listings to guests.
                </p>
                <div className="mt-6 flex items-center text-sm font-semibold text-slate-900 group-hover:text-slate-700">
                  Staff Login
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Guest */}
            <Link
              href="/stays"
              className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/80 p-8 shadow-sm transition-all hover:border-amber-200 hover:shadow-lg"
            >
              <div className="absolute right-4 top-4 opacity-10 transition-opacity group-hover:opacity-20">
                <svg className="h-16 w-16 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="relative">
                <h3 className="text-xl font-bold text-slate-900">Guest</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Explore curated stays with clear INR pricing, see real photos, and complete your booking in a few steps.
                </p>
                <div className="mt-6 flex items-center text-sm font-semibold text-slate-900 group-hover:text-slate-700">
                  Browse Stays
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">Property Ops</h3>
            <p className="mt-2 text-sm text-slate-400">
              Turn rentals into bookable listings · Streamline operations · Scale effortlessly
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
