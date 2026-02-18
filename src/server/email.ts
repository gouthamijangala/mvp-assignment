import { db } from "@/server/db";

/**
 * MVP: Log booking confirmation. Optionally send via Resend if RESEND_API_KEY is set.
 */
export async function sendBookingConfirmation(bookingId: string): Promise<void> {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { listing: true },
  });
  if (!booking || booking.status !== "CONFIRMED") return;

  const message = `Booking confirmed for ${booking.listing.title}. Check-in: ${booking.checkIn.toISOString().slice(0, 10)}, Check-out: ${booking.checkOut.toISOString().slice(0, 10)}. Total: $${(booking.totalAmount / 100).toFixed(2)}.`;
  console.log("[Email stub] Would send to:", booking.guestEmail, message);

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && !resendKey.includes("...")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM ?? "onboarding@resend.dev",
          to: booking.guestEmail,
          subject: `Booking confirmed: ${booking.listing.title}`,
          text: message,
        }),
      });
      if (!res.ok) {
        console.error("[Resend] Failed:", await res.text());
      }
    } catch (e) {
      console.error("[Resend] Error:", e);
    }
  }
}
