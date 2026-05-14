# QA Checklist

## Storefront
- Homepage loads.
- Product list loads.
- Product detail page loads.
- Active products appear.
- Inactive products do not appear to customers.

## Auth
- Google login works.
- Email/password login does not exist.
- User document is created.

## Cart
- Add to cart works.
- Quantity update works.
- Remove from cart works.
- Cart persists after refresh.

## Checkout
- Unauthenticated user is asked to sign in.
- Pending order is created.
- Payment starts.
- Payment failure is handled.
- Payment success is verified.

## WhatsApp
- WhatsApp button appears only after successful payment.
- Message includes order ID.
- Message includes customer details.
- Message includes order total.

## Admin
- Non-admin cannot access admin dashboard.
- Admin can create product.
- Admin can edit product.
- Admin can delete/deactivate product.
- Admin can view orders.
- Admin can update order status.
