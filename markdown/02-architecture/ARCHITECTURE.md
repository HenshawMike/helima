# Architecture

## App Type
Next.js ecommerce application using Firebase services.

## Recommended Next.js Structure
Use the App Router.

```txt
/app
  /(store)
    page.tsx
    products/page.tsx
    products/[id]/page.tsx
    cart/page.tsx
    checkout/page.tsx
    payment/success/page.tsx
    payment/failed/page.tsx
  /admin
    page.tsx
    products/page.tsx
    products/new/page.tsx
    products/[id]/edit/page.tsx
    orders/page.tsx
    orders/[id]/page.tsx
  /api
    payment/create/route.ts
    payment/verify/route.ts
/components
/lib
/hooks
/types
/config
```

## Firebase Services
- Firebase Auth: Google login
- Firestore: products, orders, users, admin data
- Firebase Storage: product images
- Firebase Admin SDK: server-side secure operations

## Frontend State
- Use local state or lightweight state management for cart.
- Persist cart in local storage.
- Use Firebase client SDK for public reads and auth state.
- Use server routes for payment verification and admin-sensitive actions.

## Environment Variables
Create `.env.local.example` with placeholders:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=TODO_OWNER_INPUT
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=TODO_OWNER_INPUT
NEXT_PUBLIC_FIREBASE_PROJECT_ID=TODO_OWNER_INPUT
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=TODO_OWNER_INPUT
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=TODO_OWNER_INPUT
NEXT_PUBLIC_FIREBASE_APP_ID=TODO_OWNER_INPUT

FIREBASE_ADMIN_PROJECT_ID=TODO_OWNER_INPUT
FIREBASE_ADMIN_CLIENT_EMAIL=TODO_OWNER_INPUT
FIREBASE_ADMIN_PRIVATE_KEY=TODO_OWNER_INPUT

NEXT_PUBLIC_WHATSAPP_PHONE=TODO_OWNER_INPUT
NEXT_PUBLIC_STORE_CURRENCY=TODO_OWNER_INPUT

PAYMENT_PROVIDER=TODO_OWNER_INPUT
PAYMENT_SECRET_KEY=TODO_OWNER_INPUT
NEXT_PUBLIC_PAYMENT_PUBLIC_KEY=TODO_OWNER_INPUT
```
