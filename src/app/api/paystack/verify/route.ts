import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: 'Reference parameter is required' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    const paystackSecret = process.env.PAYMENT_SECRET_KEY;
    if (!paystackSecret || paystackSecret.startsWith('TODO')) {
      return NextResponse.json({ error: 'Paystack secret key is not configured' }, { status: 500 });
    }

    // Call Paystack verify endpoint
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error('Paystack verification failed:', paystackData);
      return NextResponse.json({ error: paystackData.message || 'Paystack verification failed' }, { status: 500 });
    }

    if (paystackData.data.status === 'success') {
      const orderId = paystackData.data.metadata?.orderId;

      if (orderId) {
        // Retrieve and update order status in Firestore to 'paid'
        const orderRef = adminDb.collection('orders').doc(orderId);
        const orderSnap = await orderRef.get();

        if (orderSnap.exists) {
          const orderData = orderSnap.data();

          // Prevent duplicate payment processing
          if (orderData?.status === 'paid') {
            return NextResponse.json({ status: 'success', message: 'Order already paid' });
          }

          // Validate payment amount (Paystack amount is in kobo, order.amount is in Naira)
          const orderAmount = orderData?.totalPrice !== undefined ? orderData.totalPrice : orderData?.amount;
          const expectedAmount = Math.round((orderAmount || 0) * 100);
          if (paystackData.data.amount !== expectedAmount) {
            console.error(`Amount mismatch: Expected ${expectedAmount} kobo, got ${paystackData.data.amount} kobo.`);
            return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
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
          return NextResponse.json({ status: 'success', message: 'Payment verified and order updated' });
        } else {
          return NextResponse.json({ error: 'Order not found in database' }, { status: 404 });
        }
      } else {
        return NextResponse.json({ error: 'Order ID not found in transaction metadata' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ status: 'failed', message: `Transaction status: ${paystackData.data.status}` });
    }
  } catch (error: any) {
    console.error('Paystack verify route error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
