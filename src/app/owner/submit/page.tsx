import Link from "next/link";
import { submitOwnerIntake } from "./actions";
import { OwnerIntakeForm } from "./form";

export const metadata = {
  title: "Submit your property",
  description: "Submit your rental property for review.",
};

export default function OwnerSubmitPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-xl px-4 py-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to home
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Submit your property
        </h1>
        <p className="mt-1 text-slate-600 text-sm">
          Fill in the details below. We’ll review your submission and get back to you at the email you provide.
        </p>
        <OwnerIntakeForm action={submitOwnerIntake} />
      </div>
    </main>
  );
}
