import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/server/db";
import { sendBookingConfirmation } from "@/server/email";
import { BookingStatus } from "@prisma/client";

export async function POST(req: Request) {
  // Lazy initialization: only create Stripe client when keys are available
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  
  // If Stripe is not configured, return early (allows build to succeed)
  if (!stripeSecret || !secret || stripeSecret.includes("...")) {
    console.log("Stripe not configured - webhook endpoint inactive");
    return NextResponse.json({ message: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(stripeSecret);

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      console.error("checkout.session.completed missing metadata.bookingId");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    try {
      await db.$transaction([
        db.booking.update({
          where: { id: bookingId },
          data: {
            status: BookingStatus.CONFIRMED,
            stripeSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? null,
          },
        }),
        db.eventLog.create({
          data: {
            entityType: "Booking",
            entityId: bookingId,
            type: "booking_confirmed",
            data: {
              stripeSessionId: session.id,
              amountTotal: session.amount_total,
              currency: session.currency,
            },
          },
        }),
      ]);
    } catch (e) {
      console.error("Failed to confirm booking:", e);
      return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
    }
    await sendBookingConfirmation(bookingId);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
