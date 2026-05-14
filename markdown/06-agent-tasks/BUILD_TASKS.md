# Build Tasks

## Phase 1 — Setup
- Create Next.js app.
- Add TypeScript.
- Add Firebase SDK.
- Add environment variable example file.
- Create folder structure from architecture spec.

## Phase 2 — Firebase
- Configure Firebase client app.
- Configure Firebase Admin SDK for server routes.
- Set up Auth helper.
- Set up Firestore helper.
- Set up Storage helper.

## Phase 3 — Auth
- Implement Google Auth only.
- Create user document after first login.
- Add auth state hook.
- Add admin guard.

## Phase 4 — Storefront
- Build homepage.
- Build product list page.
- Build product detail page.
- Fetch active products from Firestore.
- Handle loading, error, and empty states.

## Phase 5 — Cart
- Implement cart state.
- Persist cart in local storage.
- Add quantity update.
- Add remove item.
- Add cart summary.

## Phase 6 — Checkout
- Require Google sign-in.
- Create pending order.
- Initialize payment.
- Redirect or open payment modal depending on provider.

## Phase 7 — Payment
- Create payment abstraction.
- Add create payment route.
- Add verify payment route.
- Mark order paid only after verified payment.

## Phase 8 — WhatsApp
- Generate WhatsApp message after payment success.
- Add WhatsApp button on success page.
- Include order ID and summary.

## Phase 9 — Admin
- Build admin dashboard.
- Build product CRUD.
- Build product image upload.
- Build order list.
- Build order detail.
- Build order status update.

## Phase 10 — Security and QA
- Add Firestore rules.
- Test non-admin access block.
- Test checkout flow.
- Test order save.
- Test payment verification path.
- Test WhatsApp link generation.
