import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import crypto from 'crypto';

// Maximum allowed request body size (1MB) to prevent DoS
const MAX_BODY_SIZE = 1_048_576;

export async function POST(request: Request) {
  try {
    // ── Read raw body with size guard ──────────────────────────
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Request body too large.' }, { status: 413 });
    }

    const rawBody = await request.text();

    if (rawBody.length > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Request body too large.' }, { status: 413 });
    }

    // ── Verify webhook signature ───────────────────────────────
    const paystackSignature = request.headers.get('x-paystack-signature');

    if (!paystackSignature) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const paystackSecret = process.env.PAYMENT_SECRET_KEY;
    if (!paystackSecret || paystackSecret.startsWith('TODO')) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // Compute expected HMAC signature
    const expectedHash = crypto
      .createHmac('sha512', paystackSecret)
      .update(rawBody)
      .digest('hex');

    // Use timing-safe comparison to prevent timing-based signature attacks
    const sigBuffer = Buffer.from(paystackSignature, 'hex');
    const hashBuffer = Buffer.from(expectedHash, 'hex');

    if (sigBuffer.length !== hashBuffer.length || !crypto.timingSafeEqual(sigBuffer, hashBuffer)) {
      console.warn('Invalid Paystack webhook signature received');
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // ── Process event ──────────────────────────────────────────
    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const transactionData = event.data;
      const orderId = transactionData.metadata?.orderId;
      const reference = transactionData.reference;

      if (orderId && typeof orderId === 'string' && adminDb) {
        const orderRef = adminDb.collection('orders').doc(orderId);
        const orderSnap = await orderRef.get();

        if (orderSnap.exists) {
          const currentData = orderSnap.data();

          // Prevent duplicate processing
          if (currentData?.status === 'paid') {
            return NextResponse.json({ received: true });
          }

          // ── Validate payment amount against stored order ────
          const orderAmount = currentData?.totalPrice !== undefined ? currentData.totalPrice : currentData?.amount;
          const expectedAmount = Math.round((orderAmount || 0) * 100);
          const actualAmount = transactionData.amount;

          if (typeof actualAmount !== 'number' || expectedAmount !== actualAmount) {
            console.error(`Webhook amount mismatch for order ${orderId}: expected ${expectedAmount}, got ${actualAmount}`);
            // Still acknowledge receipt to prevent Paystack retries,
            // but flag the order for manual review
            await orderRef.update({
              status: 'flagged',
              flagReason: `Amount mismatch: expected ${expectedAmount} kobo, received ${actualAmount} kobo`,
              updatedAt: new Date().toISOString(),
            });
            return NextResponse.json({ received: true });
          }

          await orderRef.update({
            status: 'paid',
            updatedAt: new Date().toISOString(),
            paymentDetails: {
              reference,
              channel: transactionData.channel,
              cardType: transactionData.authorization?.card_type || 'N/A',
              bank: transactionData.authorization?.bank || 'N/A',
              paidAt: transactionData.paid_at,
            }
          });
          console.log(`Order ${orderId} successfully updated to paid via webhook.`);
        }
      }
    }

    // Always acknowledge receipt to prevent Paystack retries
    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Paystack webhook route error:', error);
    // Return 200 to prevent Paystack from endlessly retrying on our errors
    return NextResponse.json({ received: true });
  }
}
