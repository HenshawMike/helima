# PAYSTACK VERIFY (HARDENED) — FIREBASE

## PURPOSE
Verify Paystack payment, validate amount, and update Firestore order safely.

---

## FLOW (ORDER IS IMPORTANT)

1. Receive reference from request
2. Verify transaction with Paystack
3. Log full Paystack response
4. Extract orderId from metadata
5. Fetch order from Firestore FIRST
6. Validate payment amount
7. Prevent duplicate updates
8. Update order → paid

---

## REQUIREMENTS

- Paystack secret key must be set
- Firebase Admin must be initialized
- order must exist before update
- metadata.orderId must be present

---

## IMPLEMENTATION

FILE: `/app/api/paystack/verify/route.ts`

```ts
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 }
      );
    }

    const secret = process.env.PAYMENT_SECRET_KEY;

    if (!secret) {
      return NextResponse.json(
        { error: "Missing Paystack secret key" },
        { status: 500 }
      );
    }

    // STEP 1: VERIFY WITH PAYSTACK
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      }
    );

    const data = await res.json();

    // LOG RESPONSE (DEBUG ONLY)
    console.log("PAYSTACK VERIFY:", data);

    if (!res.ok || !data.status) {
      return NextResponse.json(
        { error: data.message || "Verification failed" },
        { status: 500 }
      );
    }

    // STEP 2: CHECK STATUS
    if (data.data.status !== "success") {
      return NextResponse.json({
        status: "failed",
        message: data.data.status,
      });
    }

    // STEP 3: GET ORDER ID
    const orderId = data.data.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId in metadata" },
        { status: 400 }
      );
    }

    // STEP 4: FETCH ORDER FIRST
    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const order = orderSnap.data();

    // STEP 5: PREVENT DOUBLE PAYMENT
    if (order?.status === "paid") {
      return NextResponse.json({
        message: "Order already paid",
      });
    }

    // STEP 6: VALIDATE AMOUNT
    const expectedAmount = order.amount * 100;

    if (data.data.amount !== expectedAmount) {
      return NextResponse.json(
        { error: "Amount mismatch" },
        { status: 400 }
      );
    }

    // STEP 7: UPDATE ORDER
    await orderRef.update({
      status: "paid",
      paymentReference: reference,
      updatedAt: new Date().toISOString(),
      paymentDetails: {
        channel: data.data.channel,
        bank: data.data.authorization?.bank || "N/A",
        paidAt: data.data.paid_at,
      },
    });

    // STEP 8: RESPONSE
    return NextResponse.json({
      message: "Payment verified successfully",
      reference,
    });

  } catch (err: any) {
    console.error("VERIFY ERROR:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
---

## RULES (NON-NEGOTIABLE)
    1.Always log Paystack response
    2.Always fetch order before updating
    3.Always validate amount
    4.Never trust frontend success
    5.Never allow double updates
## DONE CONDITION
    1.Paystack returns success
    2.order exists in Firestore
    3.amount matches
    4.order status becomes "paid"


---

## What I Fixed (So You Don’t See That Issue Again)

- one consistent file structure
- one entry point
- no mixed explanation/code blocks
- strict step order
- production-safe logic ordering

---

If you want next upgrade, I’ll take you to:

👉 :contentReference[oaicite:0]{index=0}  
👉 or :contentReference[oaicite:1]{index=1}

Just tell me.