# Requirements

## Authentication Requirements
- Use Firebase Authentication.
- Enable Google provider only.
- Do not add email/password login.
- Do not add phone login.
- Protect admin dashboard with admin role check.

## Product Requirements
- Product must have name, description, price, category, images, stock quantity, active status, created date, and updated date.
- Only active products should show to customers.
- Out-of-stock products should be visible but not purchasable.

## Cart Requirements
- Cart can be client-side for MVP.
- Cart must persist using local storage.
- Cart must clear after successful payment.

## Checkout Requirements
- Customer must be signed in before payment.
- Checkout must collect delivery/contact details if needed.
- Order must be created before payment confirmation.
- Order must be marked as paid only after verified payment success.

## Payment Requirements
- Payment must happen inside the app.
- Payment provider is not fixed yet.
- Use a payment abstraction layer so provider can be swapped.
- Never expose secret payment keys on the frontend.

## WhatsApp Requirements
- After successful payment, show a WhatsApp button.
- WhatsApp message should include order ID, customer name, and order summary.
- WhatsApp phone number must come from config.

## Admin Requirements
- Admin users must be controlled by config or Firebase custom claims.
- Non-admin users must not access admin pages.
- Admin must be able to manage products and orders.
