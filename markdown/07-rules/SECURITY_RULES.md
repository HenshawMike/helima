# Security Rules

## Authentication Security
- Google Auth only.
- Never allow admin dashboard without admin check.
- Do not expose Firebase Admin credentials to frontend.

## Payment Security
- Payment secret keys must only be used server-side.
- Do not mark order as paid from frontend alone.
- Verify payment using server route.
- Store payment reference on the order.

## Firestore Security
- Customers can only read their own orders.
- Public users can only read active products.
- Only admins can write products.
- Only admins can update order status manually.

## Storage Security
- Product image upload must be admin-only.
- Public can read product images.

## Data Security
- Do not store unnecessary sensitive customer information.
- Keep order information minimal.
