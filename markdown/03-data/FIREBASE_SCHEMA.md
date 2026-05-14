# Firebase Firestore Schema

## Collection: users
```ts
users/{userId} = {
  uid: string,
  displayName: string,
  email: string,
  photoURL: string | null,
  role: "customer" | "admin",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Collection: products
```ts
products/{productId} = {
  name: string,
  slug: string,
  description: string,
  price: number,
  currency: string,
  category: string,
  images: string[],
  stock: number,
  isActive: boolean,
  importedFrom: "China",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Collection: orders
```ts
orders/{orderId} = {
  userId: string,
  customer: {
    name: string,
    email: string,
    phone?: string,
    address?: string
  },
  items: [
    {
      productId: string,
      name: string,
      price: number,
      quantity: number,
      image?: string
    }
  ],
  subtotal: number,
  deliveryFee: number,
  total: number,
  currency: string,
  payment: {
    provider: string,
    reference: string,
    status: "pending" | "paid" | "failed",
    paidAt?: timestamp
  },
  status: "pending_payment" | "paid" | "processing" | "completed" | "cancelled",
  whatsappMessageUrl?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Collection: settings
```ts
settings/store = {
  storeName: "Helima",
  whatsappPhone: string,
  currency: string,
  paymentProvider: string,
  updatedAt: timestamp
}
```
