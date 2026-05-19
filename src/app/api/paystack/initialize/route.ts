import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { email, amount, metadata, items } = await request.json();

    if (!email || !amount) {
      return NextResponse.json({ error: 'Email and amount are required' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    const paystackSecret = process.env.PAYMENT_SECRET_KEY;
    if (!paystackSecret || paystackSecret.startsWith('TODO')) {
      return NextResponse.json({ error: 'Paystack secret key is not configured' }, { status: 500 });
    }

    // 1. Create a secure Firestore order document with auto-ID
    const orderRef = adminDb.collection('orders').doc();
    const orderId = orderRef.id;

    // Convert amount to kobo (Paystack expects standard amounts in lowest currency unit)
    const paystackAmount = Math.round(amount * 100);

    // 2. Initialize transaction with Paystack
    const callbackUrl = `${new URL(request.url).origin}/payment/success`;
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: paystackAmount,
        callback_url: callbackUrl,
        metadata: {
          orderId,
          custom_fields: [
            {
              display_name: 'Order ID',
              variable_name: 'order_id',
              value: orderId,
            },
          ],
          ...metadata,
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error('Paystack initialization failed:', paystackData);
      return NextResponse.json({ error: paystackData.message || 'Paystack initialization failed' }, { status: 500 });
    }

    // 3. Save order details to Firestore
    await orderRef.set({
      id: orderId,
      customerEmail: email,
      customerName: `${metadata?.firstName || ''} ${metadata?.lastName || ''}`.trim() || 'Anonymous',
      shippingAddress: metadata?.shippingAddress || 'N/A',
      phoneNumber: metadata?.phoneNumber || 'N/A',
      items: items || [],
      totalPrice: amount,
      currency: 'NGN',
      status: 'pending',
      paystackReference: paystackData.data.reference,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
      orderId,
    });
  } catch (error: any) {
    console.error('Paystack initialize route error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
