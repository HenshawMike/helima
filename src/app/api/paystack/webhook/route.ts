import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const paystackSignature = request.headers.get('x-paystack-signature');

    if (!paystackSignature) {
      return NextResponse.json({ error: 'Missing x-paystack-signature header' }, { status: 401 });
    }

    const paystackSecret = process.env.PAYMENT_SECRET_KEY;
    if (!paystackSecret || paystackSecret.startsWith('TODO')) {
      return NextResponse.json({ error: 'Paystack secret key is not configured' }, { status: 500 });
    }

    // Verify webhook signature to prevent tampering
    const hash = crypto
      .createHmac('sha512', paystackSecret)
      .update(rawBody)
      .digest('hex');

    if (hash !== paystackSignature) {
      console.warn('Invalid Paystack signature received');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const transactionData = event.data;
      const orderId = transactionData.metadata?.orderId;
      const reference = transactionData.reference;

      if (orderId && adminDb) {
        const orderRef = adminDb.collection('orders').doc(orderId);
        const orderSnap = await orderRef.get();

        if (orderSnap.exists) {
          const currentData = orderSnap.data();
          if (currentData?.status !== 'paid') {
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
            console.log(`Order ${orderId} successfully updated to paid via Paystack webhook.`);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Paystack webhook route error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
