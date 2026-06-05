import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { paymentLimiter, getClientIp } from '@/lib/rate-limit';

// ─── Input validation helpers ───────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ITEMS = 50;
const MAX_METADATA_LENGTH = 500;

interface CartItemPayload {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

function isValidCartItem(item: unknown): item is CartItemPayload {
  if (!item || typeof item !== 'object') return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === 'string' && obj.id.length > 0 && obj.id.length <= 128 &&
    typeof obj.name === 'string' && obj.name.length > 0 &&
    typeof obj.price === 'number' && obj.price > 0 &&
    typeof obj.quantity === 'number' && Number.isInteger(obj.quantity) && obj.quantity > 0 && obj.quantity <= 100
  );
}

function sanitizeString(value: unknown, maxLength = MAX_METADATA_LENGTH): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    // ── Rate limiting ──────────────────────────────────────────
    const clientIp = getClientIp(request);
    const rateLimitResult = await paymentLimiter.check(clientIp);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before trying again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    // ── Parse and validate body ────────────────────────────────
    const body = await request.json();
    const { email, metadata, items, authToken, orderId: clientOrderId } = body;

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
      return NextResponse.json({ error: 'A valid items array is required (1-50 items).' }, { status: 400 });
    }

    for (const item of items) {
      if (!isValidCartItem(item)) {
        return NextResponse.json({ error: 'One or more cart items are invalid.' }, { status: 400 });
      }
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // ── Verify Firebase auth token (optional but recorded) ────
    let verifiedUserId: string | null = null;
    if (authToken && adminAuth) {
      try {
        const decodedToken = await adminAuth.verifyIdToken(authToken);
        verifiedUserId = decodedToken.uid;
      } catch {
        // Token invalid or expired — proceed but don't attach userId
        console.warn('Invalid auth token received in checkout');
      }
    }

    // ── Server-side price verification ─────────────────────────
    // CRITICAL: Never trust client-submitted prices. Fetch real
    // prices from Firestore and recompute the total.
    let serverTotal = 0;
    const verifiedItems: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      imageUrl: string;
    }> = [];

    for (const item of items) {
      const productDoc = await adminDb.collection('products').doc(item.id).get();

      if (!productDoc.exists) {
        return NextResponse.json(
          { error: `Product "${item.name}" is no longer available.` },
          { status: 400 }
        );
      }

      const productData = productDoc.data();

      if (!productData?.isActive) {
        return NextResponse.json(
          { error: `Product "${item.name}" is currently unavailable.` },
          { status: 400 }
        );
      }

      const serverPrice = productData.price;
      if (typeof serverPrice !== 'number' || serverPrice <= 0) {
        return NextResponse.json(
          { error: `Product "${item.name}" has an invalid price configuration.` },
          { status: 500 }
        );
      }

      serverTotal += serverPrice * item.quantity;

      verifiedItems.push({
        id: item.id,
        name: productData.name || item.name,
        price: serverPrice,
        quantity: item.quantity,
        imageUrl: productData.imageUrl || item.imageUrl || '',
      });
    }

    // ── Paystack configuration ─────────────────────────────────
    const paystackSecret = process.env.PAYMENT_SECRET_KEY;
    if (!paystackSecret || paystackSecret.startsWith('TODO')) {
      return NextResponse.json({ error: 'Payment provider is not configured.' }, { status: 500 });
    }

    // 1. Get or create a secure Firestore order document
    let orderRef;
    const incomingOrderId = typeof clientOrderId === 'string' && clientOrderId.trim().length > 0 ? clientOrderId.trim() : null;

    if (incomingOrderId) {
      orderRef = adminDb.collection('orders').doc(incomingOrderId);
      const existingDoc = await orderRef.get();
      if (existingDoc.exists) {
        const existingData = existingDoc.data();
        const belongsToSameUser = existingData?.customerEmail === email || (verifiedUserId && existingData?.userId === verifiedUserId);
        // Only reuse if the status is still pending AND it belongs to the same customer
        if (existingData?.status !== 'pending' || !belongsToSameUser) {
          orderRef = adminDb.collection('orders').doc();
        }
      }
    } else {
      orderRef = adminDb.collection('orders').doc();
    }
    const finalOrderId = orderRef.id;
    // Keep local variable named orderId for downstream Paystack & document write references
    const orderId = finalOrderId;

    // Convert amount to kobo (Paystack expects amounts in lowest currency unit)
    const paystackAmount = Math.round(serverTotal * 100);

    // Sanitize metadata strings
    const safeFirstName = sanitizeString(metadata?.firstName);
    const safeLastName = sanitizeString(metadata?.lastName);
    const safeAddress = sanitizeString(metadata?.shippingAddress);
    const safePhone = sanitizeString(metadata?.phoneNumber, 20);

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
        currency: 'NGN',
        channels: ['card', 'bank', 'ussd', 'bank_transfer'],
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
          firstName: safeFirstName,
          lastName: safeLastName,
          shippingAddress: safeAddress,
          phoneNumber: safePhone,
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error('Paystack initialization failed:', paystackData);

      // Surface a clearer message for known Paystack issues
      const psMessage = paystackData?.message || '';
      if (psMessage.includes('active channel')) {
        return NextResponse.json(
          { error: 'Payment channels are not yet activated. The merchant must enable payment methods on the Paystack dashboard.' },
          { status: 503 }
        );
      }

      return NextResponse.json({ error: 'Payment initialization failed. Please try again.' }, { status: 500 });
    }

    // 3. Save verified order details to Firestore
    await orderRef.set({
      id: orderId,
      ...(verifiedUserId ? { userId: verifiedUserId } : {}),
      customerEmail: email,
      customerName: `${safeFirstName} ${safeLastName}`.trim() || 'Anonymous',
      shippingAddress: safeAddress || 'N/A',
      phoneNumber: safePhone || 'N/A',
      items: verifiedItems,
      totalPrice: serverTotal,
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
  } catch (error: unknown) {
    console.error('Paystack initialize route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
