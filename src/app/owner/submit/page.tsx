import Link from "next/link";
import { submitOwnerIntake } from "./actions";
import { OwnerIntakeForm } from "./form";

export const metadata = {
  title: "Submit your property",
  description: "Submit your rental property for review.",
};

export default function OwnerSubmitPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-white">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          <span className="hidden text-xs font-medium text-emerald-700 sm:inline-flex rounded-full bg-emerald-50 px-3 py-1 border border-emerald-100">
            Step 1 · Owner submits property
          </span>
        </div>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 lg:flex-row">
        <aside className="lg:w-1/3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
              What happens after you submit?
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-emerald-900">
              <li>• Operator reviews your property details and photos.</li>
              <li>• If approved, it becomes a project in the operator dashboard.</li>
              <li>• Freelancers can be assigned to style, photograph, and set it up.</li>
              <li>• Once ready, it appears to guests on Browse Stays with INR pricing.</li>
            </ul>
            <p className="mt-4 text-xs text-emerald-800/80">
              You only need to fill this form once. You’ll be contacted on the email you provide.
            </p>
          </div>
        </aside>
        <div className="lg:w-2/3">
          <div className="mb-8 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Submit your rental for onboarding
            </h1>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Share your property details, photos, and expected INR rate. Our team will turn this into a
              guest‑ready, Airbnb‑style listing.
            </p>
          </div>
          <OwnerIntakeForm action={submitOwnerIntake} />
        </div>
      </div>
    </main>
  );
}
