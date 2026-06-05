import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

// Validate order ID to prevent injection attacks or invalid document lookups
const ORDER_ID_RE = /^[a-zA-Z0-9_-]{1,100}$/;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId || !ORDER_ID_RE.test(orderId)) {
      return NextResponse.json({ error: 'Invalid or missing Order ID.' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database configuration error.' }, { status: 500 });
    }

    const orderDoc = await adminDb.collection('orders').doc(orderId).get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const orderData = orderDoc.data();

    // Securely return only non-sensitive fields to the public tracking client
    return NextResponse.json({
      id: orderDoc.id,
      status: orderData?.status || 'pending',
      customerName: orderData?.customerName || 'Anonymous',
      createdAt: orderData?.createdAt || new Date().toISOString(),
      itemsCount: orderData?.items?.length || 0,
    });
  } catch (error) {
    console.error('Order tracking API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
