import Link from "next/link";
import { submitOwnerIntake } from "./actions";
import { OwnerIntakeForm } from "./form";

export const metadata = {
  title: "Submit your property",
  description: "Submit your rental property for review.",
};

export default function OwnerSubmitPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Submit Your Property
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Fill in the details below. We'll review your submission and get back to you at the email you provide.
          </p>
        </div>
        <OwnerIntakeForm action={submitOwnerIntake} />
      </div>
    </main>
  );
}
