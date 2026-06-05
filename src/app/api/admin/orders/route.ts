import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { getOrdersServer } from '@/lib/firebase/firestore-admin';

async function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split('Bearer ')[1];
  if (!adminAuth) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const { adminDb } = await import('@/lib/firebase/admin');
    if (!adminDb) return null;
    const roleDoc = await adminDb.collection('roles').doc(decoded.uid).get();
    if (!roleDoc.exists || roleDoc.data()?.role !== 'admin') return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await getOrdersServer();
  return NextResponse.json(orders);
}
