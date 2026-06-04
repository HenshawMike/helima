import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import crypto from 'crypto';
import { apiLimiter, getClientIp } from '@/lib/rate-limit';

// Paystack references are alphanumeric with possible hyphens/underscores
const REFERENCE_RE = /^[a-zA-Z0-9_-]{1,100}$/;

export async function GET(request: Request) {
  try {
    // ── Rate limiting ──────────────────────────────────────────
    const clientIp = getClientIp(request);
    const rateLimitResult = await apiLimiter.check(clientIp);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before trying again.' },
        { status: 429 }
      );
    }

    // ── Validate reference parameter ───────────────────────────
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference || !REFERENCE_RE.test(reference)) {
      return NextResponse.json({ error: 'Invalid reference parameter.' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const paystackSecret = process.env.PAYMENT_SECRET_KEY;
    if (!paystackSecret || paystackSecret.startsWith('TODO')) {
      return NextResponse.json({ error: 'Payment provider is not configured.' }, { status: 500 });
    }

    // ── Verify with Paystack ───────────────────────────────────
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error('Paystack verification failed:', paystackData);
      return NextResponse.json({ error: 'Payment verification failed.' }, { status: 500 });
    }

    if (paystackData.data.status === 'success') {
      const orderId = paystackData.data.metadata?.orderId;

      if (!orderId || typeof orderId !== 'string') {
        return NextResponse.json({ error: 'Invalid transaction metadata.' }, { status: 400 });
      }

      // Retrieve and update order status in Firestore to 'paid'
      const orderRef = adminDb.collection('orders').doc(orderId);
      const orderSnap = await orderRef.get();

      if (!orderSnap.exists) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }

      const orderData = orderSnap.data();

      // Prevent duplicate payment processing
      if (orderData?.status === 'paid') {
        return NextResponse.json({ status: 'success', message: 'Order already confirmed.' });
      }

      // ── Timing-safe amount validation ──────────────────────
      // Compare webhook amount against stored order amount to
      // prevent partial payment or amount manipulation attacks.
      const orderAmount = orderData?.totalPrice !== undefined ? orderData.totalPrice : orderData?.amount;
      const expectedAmount = Math.round((orderAmount || 0) * 100);
      const actualAmount = paystackData.data.amount;

      // Use constant-time comparison via buffer comparison
      const expectedBuf = Buffer.alloc(8);
      const actualBuf = Buffer.alloc(8);
      expectedBuf.writeDoubleBE(expectedAmount);
      actualBuf.writeDoubleBE(actualAmount);

      if (!crypto.timingSafeEqual(expectedBuf, actualBuf)) {
        console.error(`Amount mismatch: Expected ${expectedAmount} kobo, got ${actualAmount} kobo for order ${orderId}.`);
        return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 });
      }

      await orderRef.update({
        status: 'paid',
        updatedAt: new Date().toISOString(),
        paymentDetails: {
          reference,
          channel: paystackData.data.channel,
          cardType: paystackData.data.authorization?.card_type || 'N/A',
          bank: paystackData.data.authorization?.bank || 'N/A',
          paidAt: paystackData.data.paid_at,
        }
      });
      return NextResponse.json({ status: 'success', message: 'Payment verified and order updated.' });
    } else {
      return NextResponse.json({ status: 'failed', message: 'Transaction was not successful.' });
    }
  } catch (error: unknown) {
    console.error('Paystack verify route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
