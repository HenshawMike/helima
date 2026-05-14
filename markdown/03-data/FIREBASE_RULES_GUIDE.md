# Firebase Security Rules Guide

## Rule Principles
- Public users can read active products only.
- Only admins can create, update, or delete products.
- Customers can read their own orders.
- Customers can create checkout orders for themselves.
- Only server-side verified payment logic can mark orders as paid.
- Admins can read and update all orders.

## Important Security Note
Do not rely only on frontend checks for admin access.
Use Firebase custom claims or a secure admin role strategy.

## Suggested Rules Direction
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() && request.auth.token.admin == true;
    }

    match /products/{productId} {
      allow read: if resource.data.isActive == true || isAdmin();
      allow create, update, delete: if isAdmin();
    }

    match /orders/{orderId} {
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow read: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid);
      allow update: if isAdmin();
      allow delete: if false;
    }

    match /users/{userId} {
      allow read, update: if isSignedIn() && request.auth.uid == userId;
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow delete: if false;
    }
  }
}
```

## Agent Instruction
Treat the above as a guide, not final copy-paste production rules. Validate rules against the exact implementation.
