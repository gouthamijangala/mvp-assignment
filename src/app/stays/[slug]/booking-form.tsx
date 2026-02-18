"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { createBookingAction } from "./actions";

const initialState: { error?: string; redirectUrl?: string } = {};

function BookButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-slate-800 py-3 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {pending ? "Processing…" : "Book now"}
    </button>
  );
}

export function BookingForm({
  listingId,
  nightlyRate,
  cleaningFee,
  maxGuests,
}: {
  listingId: string;
  nightlyRate: number;
  cleaningFee: number;
  maxGuests: number;
}) {
  const [state, formAction] = useActionState(createBookingAction, initialState);

  if (state?.redirectUrl) {
    window.location.href = state.redirectUrl;
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-slate-600 text-sm">Redirecting to checkout…</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="nightlyRate" value={nightlyRate} />
      <input type="hidden" name="cleaningFee" value={cleaningFee} />
      <input type="hidden" name="maxGuests" value={maxGuests} />
      <h3 className="text-sm font-semibold text-slate-900">Book your stay</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="checkIn" className="input-label">Check-in</label>
          <input
            id="checkIn"
            name="checkIn"
            type="date"
            required
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="checkOut" className="input-label">Check-out</label>
          <input
            id="checkOut"
            name="checkOut"
            type="date"
            required
            className="input-field"
          />
        </div>
      </div>
      <div>
        <label htmlFor="guests" className="input-label">Guests</label>
        <input
          id="guests"
          name="guests"
          type="number"
          min={1}
          max={maxGuests}
          defaultValue={1}
          required
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="guestEmail" className="input-label">Your email</label>
        <input
          id="guestEmail"
          name="guestEmail"
          type="email"
          required
          className="input-field"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="guestName" className="input-label">Your name (optional)</label>
        <input
          id="guestName"
          name="guestName"
          type="text"
          className="input-field"
          placeholder="For the reservation"
        />
      </div>
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3" role="alert">
          <p className="error-text">{state.error}</p>
        </div>
      )}
      <BookButton />
    </form>
  );
}
