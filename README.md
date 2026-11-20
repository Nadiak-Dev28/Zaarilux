# Zaarilux

A mobile-first Pakistani storefront for reusable baby care, period essentials, and bedding. Built with React, TypeScript, React Router, Vite, and Tailwind CSS v4. The visual system uses locally hosted Lora and DM Sans fonts, sage accents, and replaceable editorial product photography.

## Run locally

Use Node.js 24 LTS (see `.nvmrc`) and npm. Node 24 supports the shared TypeScript catalog imported by the serverless function.

```sh
npm ci
npm run dev
```

This starts the **storefront only**. A plain Vite server or static preview does not run `/api/order`. The cart stays intact if the order service is unavailable.

For the **complete storefront and order API**, run:

```sh
cp .env.example .env
# Set the three server-only variables described below.
npx tsx scripts/dev.mjs
```

Stop the plain Vite process first, or select another port using `PORT=5174 npx tsx scripts/dev.mjs`. The local adapter calls the same `api/order.js` handler deployed on Vercel. It never simulates a successful order.

## Email configuration

Create a Resend account, verify your sending domain in Resend, and create an API key with sending permission. Set these variables in `.env` locally and in Vercel project settings for deployment:

| Environment variable | Purpose                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| `RESEND_API_KEY`     | Server-side Resend sending credential                                     |
| `ORDER_TO_EMAIL`     | Store owner's actual order-notification inbox                             |
| `ORDER_FROM_EMAIL`   | Sender address on your Resend-verified domain; a display name is optional |

An email address shown publicly on the contact page does **not** configure the recipient. The order function reads all three settings exclusively from its server environment. Never prefix these variables with `VITE_`, commit credentials, or add them to frontend files. `.env.example` is intentionally blank.

## Deploy on Vercel

1. Commit the project to a GitHub repository. If starting a new repository, run `git init`, add your GitHub remote, then commit and push the project files. Do not commit `.env`, `node_modules`, `.vercel`, or `dist`.
2. In Vercel, select **Add New > Project** and import the GitHub repository.
3. Use the repository root, select the **Vite** framework preset, and set the Node.js runtime to **24.x**.
4. Use install command `npm ci`, build command `npm run build`, and output directory `dist`. The package build script is `vite build`.
5. Add `RESEND_API_KEY`, `ORDER_TO_EMAIL`, and `ORDER_FROM_EMAIL` under **Settings > Environment Variables**. Configure Production, and Preview if preview checkout should send orders. Use a separate test recipient for previews.
6. Deploy. `vercel.json` preserves `/api/order` as a function and rewrites client-side page routes to the application. Refreshing a product page works without a 404.
7. Place a controlled test order, verify the owner's email, confirm the totals and order number, and check that the cart clears. Resend acceptance is not a guarantee of inbox delivery: check the Resend dashboard and sender DNS if email does not arrive.
8. Attach the store's domain only after reviewing the content and completing the test. Redeploy after changing environment variables.

Do not upload only `dist` to a static host and expect order emails to work. The API function must be deployed with the site.

## Edit the store

| File                    | Contents                                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/products.ts`  | The five products, current/previous prices in whole Pakistani rupees, variants, descriptions, product care, every image path, and shipping settings |
| `src/data/content.ts`   | Brand, homepage copy, navigation, contact details, FAQ, form labels, field errors, sample reviews, policies, and WhatsApp link builder              |
| `public/images/`        | Optimized WebP images. Replace files in place or change the image map in `products.ts`                                                              |
| `public/fonts/`         | Locally served fonts, with no external font request required                                                                                        |
| `src/index.css`         | Core visual tokens, typography, layout, and homepage styling                                                                                        |
| `src/styles/`           | Product, shopping, information-page, responsive, and reduced-motion styles                                                                          |
| `src/lib/cart.tsx`      | Validated, versioned, local-storage cart with separate size/colour selections                                                                       |
| `src/lib/order.ts`      | Shared customer validation, Pakistani mobile normalization, and authoritative server order validation                                               |
| `api/order.js`          | Vercel Node function, escaped HTML and text emails, Resend integration, and retry protection                                                        |
| `server/order-email.js` | Readable HTML and plain-text notification layouts, with editable labels in `content.ts`                                                             |
| `src/pages/`            | Home, shop, product, cart, checkout, confirmation, tracking, and information pages                                                                  |

**Launch checklist:** The product images are neutral, AI-generated editorial placeholders, not photographs of verified stock. Review the sample colours, sizes, actual measurements, materials, care instructions, and 8-hour product qualification before launch. All five requested prices are preloaded. Reviews are explicitly marked samples and have no fabricated names, ratings, or sales counts.

The editable **standard delivery charge is Rs 200** below the free-shipping threshold. Free delivery applies at **Rs 2,000 and above**. This flat rate is a configurable launch default, not a rate verified from the old store. Confirm it with the owner. Cart, checkout, and the server all use the same shipping function.

The WhatsApp number comes from the existing store's contact link, and the public email and return eligibility are based on its refunds page. Verify the contact information, policy text, delivery arrangements, and hygiene/sale exclusions before launch. No delivery-time guarantee, unknown social profile, or physical address has been invented. Social links provide WhatsApp contact and Facebook sharing.

## Pages and shopping behaviour

- `/`: full homepage, in the requested section order.
- `/shop`: shareable category, search, and price sorting via `category`, `q`, and `sort` query parameters.
- `/product/:id`: gallery, detail view, colour and size options, fit guidance, quantity, cart, and product-specific WhatsApp ordering.
- `/cart`: persistent cart, quantities, removal, totals, and free-shipping progress. The header cart button opens a keyboard-accessible drawer.
- `/checkout`: client-validated, Cash on Delivery checkout. Optional email and notes; no financial information collected.
- `/order-success`: successful order receipt and manual tracking link. A limited receipt survives refresh in session storage, without the full address or phone number.
- `/track-order`: validates the order number and Pakistani phone, then prepares a WhatsApp enquiry. It does not claim to look up a courier status.
- `/about`, `/contact`, `/refunds-returns`, `/privacy-policy`: fully routed information pages.

## Order handling

Checkout posts JSON to `/api/order` containing `customer`, `items`, `subtotal`, `shipping`, `total`, `timestamp`, `requestId`, `paymentMethod`, and the empty `website` honeypot. Each item has `productId`, `name`, `qty`, `unitPrice`, `size`, and `color`.

The function accepts only JSON POST requests, limits body and field lengths, validates phone numbers and optional email, normalizes text, and checks catalog IDs, variants, integer quantities, and duplicate lines. Prices and totals are recalculated using the shared catalog. Mismatched values are rejected, not silently applied. All customer text is escaped before insertion into email HTML.

The store owner receives a readable HTML and plain-text summary with an order reference, delivery details, item table, notes, shipping, and COD total. The email recipient and sender cannot be selected through the incoming request. A stable, HMAC-derived order reference and Resend idempotency key protect unchanged retries within Resend's 24-hour deduplication window.

Only a confirmed Resend API acceptance returns `201` and a receipt. The client then clears the cart and routes to success. Errors preserve the form and cart, with a WhatsApp fallback. Status codes include `400` (invalid data/honeypot), `405` (method), `409` (catalog/total conflict), `413` (size limit), `415` (content type), `429` (mail throttling), `502` (mail failure), and `503` (unconfigured service).

There is intentionally no order database, automated courier tracking, customer login, or card gateway. The owner email is the fulfilment record. For a higher-volume production store, add durable order storage and rate limiting through a shared store or Vercel Firewall. A honeypot is basic spam protection, not a comprehensive anti-abuse system.

## Verification

```sh
npx tsc --noEmit
node --import tsx --test tests/order.test.mjs
npx playwright install --with-deps chromium
npx playwright test
npm run build
```

Backend tests inject an in-memory mail transport; browser tests mock successful email acceptance and exercise genuine validation and routing. The test suite never requires a real API key or contacts a live customer. A final live Resend delivery test requires your verified domain, credentials, and recipient.
