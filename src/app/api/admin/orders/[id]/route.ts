import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { updateOrderStatusServer } from '@/lib/firebase/firestore-admin';

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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }
    await updateOrderStatusServer(id, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
