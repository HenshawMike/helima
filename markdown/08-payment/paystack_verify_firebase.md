# PAYSTACK VERIFY → FIREBASE ORDER UPDATE

## PURPOSE
Verify Paystack payment and update order status in Firebase Firestore

---

## DEPENDENCIES
- Firebase Admin SDK
- Paystack Secret Key

---

## INPUT
reference: string (from query params)

---

## OUTPUT
order.status = "paid"

---

## FIREBASE SETUP (BACKEND ONLY)

import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

---

## VERIFY + UPDATE FLOW

1. receive reference from request
2. call Paystack verify endpoint
3. check if payment status = success
4. extract orderId from metadata
5. find order in Firestore
6. update order status → paid
7. store payment reference

---

## IMPLEMENTATION (NEXT.JS API ROUTE)

FILE: /app/api/paystack/verify/route.ts

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json({ error: "No reference" }, { status: 400 });
    }

    // VERIFY WITH PAYSTACK
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

    if (data.data.status !== "success") {
      return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
    }

    const orderId = data.data.metadata.orderId;

    // UPDATE FIRESTORE
    const orderRef = db.collection("orders").doc(orderId);

    await orderRef.update({
      status: "paid",
      paymentReference: reference,
      paidAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Payment verified and order updated",
      reference,
    });

  } catch (err: any) {
    console.error("VERIFY ERROR:", err.message);

    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}

---

## FIRESTORE STRUCTURE

collection: orders

document:
id: string (orderId)
userId: string
email: string
amount: number
status: "pending" | "paid"
paymentReference: string
paidAt: string

---

## RULES

- only update order if status === success
- orderId must come from metadata
- never trust frontend
- do not update order twice

---

## DONE CONDITION

- payment completed
- verify endpoint called once
- Firestore order updated → paid