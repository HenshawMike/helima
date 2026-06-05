import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { deleteCategoryServer } from '@/lib/firebase/firestore-admin';

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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteCategoryServer(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
