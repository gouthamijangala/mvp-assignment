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
      className="w-full btn-primary py-3.5 text-base"
    >
      {pending ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        "Book Now"
      )}
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
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="nightlyRate" value={nightlyRate} />
      <input type="hidden" name="cleaningFee" value={cleaningFee} />
      <input type="hidden" name="maxGuests" value={maxGuests} />
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-900">Book your stay</h3>
        <p className="mt-1 text-sm text-slate-600">Fill in your details to complete your booking</p>
      </div>
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
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4" role="alert">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="error-text">{state.error}</p>
          </div>
        </div>
      )}
      <div className="pt-2">
        <BookButton />
      </div>
    </form>
  );
}
