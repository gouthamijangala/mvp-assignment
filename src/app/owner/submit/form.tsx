"use client";

import { useState } from "react";
import Link from "next/link";

type OwnerIntakeState = { error?: string; success?: boolean };

export function OwnerIntakeForm({
  action: _action,
}: {
  action: (prev: OwnerIntakeState, formData: FormData) => Promise<OwnerIntakeState>;
}) {
  const [state, setState] = useState<OwnerIntakeState>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({});
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/owner/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setState({ success: true });
        return;
      }
      setState({ error: data.error ?? "Something went wrong. Please try again." });
    } catch (err) {
      setState({
        error:
          err instanceof Error ? err.message : "Network error. Check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (state?.success) {
    return (
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-green-900">Submission received</h2>
        <p className="mt-2 text-sm text-green-800">
          We’ll review your property and contact you at the email you provided. You don’t need to do anything else for now.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-green-700 hover:text-green-800"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>
          <p className="mt-1 text-sm text-slate-600">We'll use this to reach out about your property</p>
        </div>
        <div className="space-y-5">
          <div>
            <label htmlFor="ownerName" className="input-label">Your name</label>
            <input
              id="ownerName"
              name="ownerName"
              type="text"
              required
              className="input-field"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label htmlFor="ownerEmail" className="input-label">Email</label>
            <input
              id="ownerEmail"
              name="ownerEmail"
              type="email"
              required
              className="input-field"
              placeholder="jane@example.com"
            />
            <p className="helper-text">We’ll use this to contact you about your property.</p>
          </div>
        </div>
      </section>

      {/* Property details */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Property Details</h2>
          <p className="mt-1 text-sm text-slate-600">Tell us about your rental property</p>
        </div>
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="input-label">Property title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="input-field"
              placeholder="e.g. Cozy 2BR near downtown"
            />
          </div>
          <div>
            <label htmlFor="description" className="input-label">Description</label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="input-field resize-y"
              placeholder="Brief description of the property, amenities, and what guests can expect."
            />
          </div>
          <div>
            <label htmlFor="address" className="input-label">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              required
              className="input-field"
              placeholder="Full street address (used for our records only)"
            />
          </div>
        </div>
      </section>

      {/* Pricing & capacity */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Pricing & Capacity</h2>
          <p className="mt-1 text-sm text-slate-600">
            Set your expected rates in <span className="font-semibold">INR (₹)</span> and guest capacity
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="baseNightlyRate" className="input-label">
              Expected nightly rate (₹)
            </label>
            <input
              id="baseNightlyRate"
              name="baseNightlyRate"
              type="number"
              min={1}
              required
              className="input-field"
              placeholder="3500"
            />
            <p className="helper-text">
              An approximate INR rate per night. We&apos;ll fine‑tune pricing when the guest‑facing listing is created.
            </p>
          </div>
          <div>
            <label htmlFor="maxGuests" className="input-label">Max guests</label>
            <input
              id="maxGuests"
              name="maxGuests"
              type="number"
              min={1}
              max={50}
              required
              className="input-field"
              placeholder="4"
            />
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Property Photos</h2>
          <p className="mt-1 text-sm text-slate-600">Upload high-quality photos of your property</p>
        </div>
        <div>
          <label className="input-label">Upload at least one photo</label>
          <input
            name="photos"
            type="file"
            accept="image/*"
            multiple
            required
            className="mt-1 w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:font-medium file:text-slate-800"
          />
          <p className="helper-text">JPEG or PNG. Keep total size under 4MB for a smooth upload.</p>
        </div>
      </section>

      {/* Consent & submit */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-500 focus:ring-2"
          />
          <label htmlFor="consent" className="text-sm leading-6 text-slate-700">
            I agree to the use of my contact and property details for listing and operations. I understand my submission will be reviewed before going live.
          </label>
        </div>

        {state?.error && (
          <div className="mt-6 rounded-lg border-2 border-red-200 bg-red-50 p-4" role="alert">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="error-text">{state.error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full btn-primary text-base py-3.5"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Property"
          )}
        </button>
      </section>
    </form>
  );
}
