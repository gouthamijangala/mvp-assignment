"use server";

import { z } from "zod";
import { db } from "@/server/db";
import { BookingStatus } from "@prisma/client";

const bookingSchema = z.object({
  listingId: z.string().min(1),
  nightlyRate: z.coerce.number().int().min(0),
  cleaningFee: z.coerce.number().int().min(0),
  maxGuests: z.coerce.number().int().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.coerce.number().int().min(1),
  guestEmail: z.string().email(),
  guestName: z.string().max(200).optional(),
});

export type BookingActionState = { error?: string; redirectUrl?: string };

export async function createBookingAction(
  _prev: BookingActionState,
  formData: FormData
): Promise<BookingActionState> {
  const raw = {
    listingId: formData.get("listingId"),
    nightlyRate: formData.get("nightlyRate"),
    cleaningFee: formData.get("cleaningFee"),
    maxGuests: formData.get("maxGuests"),
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    guests: formData.get("guests"),
    guestEmail: formData.get("guestEmail"),
    guestName: formData.get("guestName") || undefined,
  };
  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors).flat().join(" ") || "Invalid dates or details.";
    return { error: msg };
  }

  const { listingId, nightlyRate, cleaningFee, checkIn, checkOut, guestEmail, guestName } = parsed.data;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (checkOutDate <= checkInDate) {
    return { error: "Check-out must be after check-in." };
  }
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmountDollars = nights * nightlyRate + cleaningFee;
  const totalAmountCents = Math.round(totalAmountDollars * 100);

  const booking = await db.booking.create({
    data: {
      listingId,
      guestEmail,
      guestName: guestName ?? null,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalAmount: totalAmountCents,
      currency: "usd",
      status: BookingStatus.PENDING_PAYMENT,
    },
  });

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret || stripeSecret.includes("...")) {
    // No Stripe: redirect to success (MVP test without payment)
    return { redirectUrl: `/booking/success?bookingId=${booking.id}` };
  }

  // Stripe flow: create session and redirect (see stripe-checkout.ts)
  const { createCheckoutSession } = await import("./stripe-checkout");
  return createCheckoutSession(booking.id, totalAmountCents, guestEmail, formData);
}
