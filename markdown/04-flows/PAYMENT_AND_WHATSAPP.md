# Payment and WhatsApp Spec

## Payment Requirement
The website must support in-app payment.

## Provider Status
Payment provider is not decided.
The agent must not invent a provider as final.
Use placeholder/provider abstraction until owner chooses.

## Suggested Nigerian-Friendly Providers
The owner may later choose one of:
- Paystack
- Flutterwave
- Stripe, if available for the business setup

## Required Payment Steps
1. Create order with `pending_payment` status.
2. Send order total to payment provider.
3. Redirect or open payment modal.
4. Verify payment server-side.
5. Update order to `paid` only after verification.
6. Generate WhatsApp link.
7. Show success page.

## WhatsApp Message Template
```txt
Hello Helima, I just completed payment for my order.

Order ID: {{orderId}}
Name: {{customerName}}
Email: {{customerEmail}}
Items: {{orderItems}}
Total: {{currency}} {{total}}

Please confirm my order.
```

## WhatsApp Link Format
```txt
https://wa.me/{{WHATSAPP_PHONE}}?text={{ENCODED_MESSAGE}}
```

## Security Rule
Never trust frontend payment success alone.
Always verify payment on the server before marking order as paid.
