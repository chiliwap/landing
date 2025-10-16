This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Billing & Payment Method Security (Demo Only)

This project includes a demo payment method form. It intentionally DOES NOT
store full card numbers (PAN) or CVV values and only persists non-sensitive
metadata: `brand`, `last4`, `exp_month`, `exp_year`, `name`, and `address`.

IMPORTANT:

- Do NOT use this demo to process real payments.
- For production, integrate a PCI-compliant provider (Stripe, Adyen, Braintree,
  etc.) and collect card data via provider-hosted fields or client-side
  tokenization.
- Never log or persist PAN or CVV. They should exist only transiently in a
  secure, tokenizing library context.
- Replace the current `submitMethodChange` action with one that exchanges a
  provider token (e.g. Stripe PaymentMethod ID) instead of handling raw digits.

The current implementation demonstrates:

- Basic validation and derivation of `last4` client-side/server-side.
- Immediate discarding of raw card number & CVV after deriving `last4`.
- A delete action (`deleteBillingMethod`) supporting optimistic UI removal.

Refer to `components/forms/actions/method.tsx` for inline security notes.

### Stripe Integration

The app now integrates with Stripe purely for securely storing card payment
methods.

What happens when a card is added:

- A Stripe Customer is searched/created using the authenticated app user ID
  (stored in `metadata.app_user_id`).
- A Stripe PaymentMethod (type `card`) is created server-side (demo only — in
  production use Stripe Elements or the Payment Element to avoid handling raw
  PAN/CVC directly).
- The PaymentMethod is attached to the Customer and (if none set) becomes their
  default.
- Only non-sensitive card metadata plus the Stripe `pmId` are stored in DynamoDB
  (`Billing.methods`). No PAN or CVC is persisted.

When a method is deleted:

- If the method has a `pmId`, it is detached from Stripe.
- The record is removed from the user's `Billing` item. If it was default, the
  next available method is set both locally and (if it has a `pmId`) on the
  Stripe Customer.

### Required Environment Variables

Add the following to your environment (e.g. `.env.local`):

```
STRIPE_SECRET_KEY=sk_live_or_test_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Optional (only needed if you later add client-side Stripe Elements):

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key
```

### Data Model Changes

- `Card` now includes an optional `pmId` (Stripe PaymentMethod ID).
- `Billing.methods` is now a standard `Card[]` array instead of a tuple type.

### Caveats / Next Steps for Production

- Replace raw server-side creation of PaymentMethods with Stripe Elements to
  eliminate PCI scope.
- Add webhooks (`/api/webhooks/stripe`) to stay in sync with Customer and
  PaymentMethod updates.
- Consider using Stripe Setup Intents for SCA-compliant future off-session
  usage.
- Add error surface in UI for Stripe-specific validation failures. Open
  [http://localhost:3000](http://localhost:3000) with your browser to see the
  result.

You can start editing the page by modifying `app/page.tsx`. The page
auto-updates as you edit the file.

This project uses
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to automatically optimize and load [Geist](https://vercel.com/font), a new font
family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out
[the Next.js GitHub repository](https://github.com/vercel/next.js) - your
feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our
[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
for more details.
