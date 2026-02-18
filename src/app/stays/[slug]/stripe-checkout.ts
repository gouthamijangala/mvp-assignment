"use server";

import Stripe from "stripe";
import type { BookingActionState } from "./actions";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function createCheckoutSession(
  bookingId: string,
  totalAmountCents: number,
  guestEmail: string,
  _formData: FormData
): Promise<BookingActionState> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || secret.includes("...")) {
    return { redirectUrl: `/booking/success?bookingId=${bookingId}` };
  }

  const stripe = new Stripe(secret);
  const base = getBaseUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: guestEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: totalAmountCents,
          product_data: {
            name: "Booking",
            description: "Property booking",
          },
        },
      },
    ],
    metadata: { bookingId },
    success_url: `${base}/booking/success?bookingId=${bookingId}`,
    cancel_url: `${base}/booking/canceled?bookingId=${bookingId}`,
  });

  if (session.url) return { redirectUrl: session.url };
  return { error: "Could not create checkout session." };
}
