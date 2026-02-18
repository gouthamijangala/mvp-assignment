# Manual test cases (MVP)

Use these steps to validate the full flow. Ensure `DATABASE_URL` is set and migrations are applied (`npm run prisma:migrate`). The app builds with `npm run build`; dynamic routes are not prerendered so no DB is required at build time. For operator login, set `OPERATOR_EMAIL` and `OPERATOR_PASSWORD` in `.env.local`.

## Happy path: owner intake → approval → freelancer apply → assign → listing → guest booking

1. **Owner intake**
   - Go to `/owner/submit`.
   - Fill: name, email, property title, description, address, nightly rate, max guests, at least one photo (file), consent checkbox.
   - Submit. Expect: "Submission received".

2. **Operator: approve project**
   - Go to `/admin/signin`. Sign in with operator email/password.
   - Go to `/admin/projects`. Filter by "Intake". Open the new project.
   - Click **Approve**. Expect: project status becomes "Waiting freelancer".

3. **Freelancer: apply**
   - Go to `/freelancer/projects`. See the open project.
   - Fill name, email, optional message. Click **Apply**. Expect: "Application submitted."

4. **Operator: assign freelancer**
   - In admin, open the same project. In **Applications**, click **Assign** for the application.
   - Expect: project status "Assigned", assigned freelancer shown.

5. **Operator: create and publish listing**
   - On project detail, fill **Listing**: slug (e.g. `cozy-downtown`), title, description, nightly rate, cleaning fee, max guests.
   - Click **Save draft**. Then click **Publish**. Expect: listing status Published.

6. **Guest: book**
   - Go to `/stays/cozy-downtown` (use the slug you set). See listing and booking form.
   - Fill check-in, check-out, guests, email, name. Click **Book now**.
   - **Without Stripe**: redirect to `/booking/success?bookingId=...` and see confirmation.
   - **With Stripe (test mode)**: redirect to Stripe Checkout; pay with card `4242 4242 4242 4242`; then redirect to success. Webhook confirms booking and logs confirmation.

## Quick checks

- **Admin list**: `/admin/projects` shows all projects; status filter works.
- **Reject**: On an Intake project, **Reject** sets property to Rejected.
- **Booking canceled**: From Stripe Checkout, cancel → `/booking/canceled`.

## Stripe webhook (local)

Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`. Set `STRIPE_WEBHOOK_SECRET` to the printed secret. Trigger a test payment to confirm webhook updates booking to CONFIRMED and EventLog is created.
