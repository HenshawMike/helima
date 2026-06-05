import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import {
  getAdminProductsServer,
  createProductServer,
} from '@/lib/firebase/firestore-admin';

async function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split('Bearer ')[1];
  if (!adminAuth) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    // Check admin role via custom claims or Firestore roles collection
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

  const products = await getAdminProductsServer();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = await createProductServer(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
