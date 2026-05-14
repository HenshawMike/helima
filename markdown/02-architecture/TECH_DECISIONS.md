# Technical Decisions

## Next.js
Use Next.js because the user requested it.

## Firebase
Use Firebase because the user requested it.

## Auth
Use only Google Auth.

## Database
Use Firestore.

## Storage
Use Firebase Storage for product images.

## Payment
Payment provider is not specified.
Build the payment layer with an interface:

```ts
createPayment(order): Promise<PaymentInitResult>
verifyPayment(reference): Promise<PaymentVerificationResult>
```

This prevents the codebase from being locked to one provider too early.

## WhatsApp
WhatsApp should not replace order storage.
The order must be saved first, then WhatsApp link is shown after payment success.
