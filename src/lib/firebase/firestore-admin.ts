import { adminDb } from './admin';
import type { Product, Category } from './firestore';

// ==========================================
// SERVER-SIDE FIRESTORE QUERIES (Admin SDK)
// Use these in Server Components & generateMetadata
// ==========================================

/**
 * Recursively converts Firestore Timestamp instances and other
 * non-serializable admin SDK types into plain JSON-safe values.
 * This is required because Server Components can only pass
 * plain objects to Client Components.
 */
function serialize<T>(data: any): T {
  return JSON.parse(JSON.stringify(data));
}

// ==========================================
// READ OPERATIONS (for Server Components)
// ==========================================

export async function getProductsServer(): Promise<Product[]> {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb
      .collection('products')
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => serialize<Product>({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching products (admin):', error);
    return [];
  }
}

export async function getCategoriesServer(): Promise<Category[]> {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb.collection('categories').get();
    return snapshot.docs.map(doc => serialize<Category>({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching categories (admin):', error);
    return [];
  }
}

export async function getProductByIdServer(id: string): Promise<Product | null> {
  if (!adminDb) return null;
  try {
    const docSnap = await adminDb.collection('products').doc(id).get();
    if (docSnap.exists) {
      return serialize<Product>({ id: docSnap.id, ...docSnap.data() });
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by id (admin):', error);
    return null;
  }
}

export async function getFeaturedProductsServer(count: number = 4): Promise<Product[]> {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb
      .collection('products')
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(count)
      .get();

    return snapshot.docs.map(doc => serialize<Product>({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching featured products (admin):', error);
    return [];
  }
}

export async function getProductsByCategoryServer(categorySlug: string): Promise<Product[]> {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb
      .collection('products')
      .where('isActive', '==', true)
      .where('category', '==', categorySlug)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => serialize<Product>({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching products by category (admin):', error);
    return [];
  }
}

// ==========================================
// ADMIN DASHBOARD OPERATIONS (for API Routes)
// ==========================================

export async function getAdminProductsServer(): Promise<Product[]> {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb
      .collection('products')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => serialize<Product>({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return [];
  }
}

export async function createProductServer(product: Omit<Product, 'id'>) {
  if (!adminDb) throw new Error('Database not initialized');
  const docRef = await adminDb.collection('products').add({
    ...product,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

export async function updateProductServer(id: string, product: Partial<Product>) {
  if (!adminDb) throw new Error('Database not initialized');
  await adminDb.collection('products').doc(id).update({
    ...product,
    updatedAt: new Date(),
  });
}

export async function deleteProductServer(id: string) {
  if (!adminDb) throw new Error('Database not initialized');
  await adminDb.collection('products').doc(id).delete();
}

export async function getOrdersServer() {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb
      .collection('orders')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => serialize<any>({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function updateOrderStatusServer(id: string, status: string) {
  if (!adminDb) throw new Error('Database not initialized');
  await adminDb.collection('orders').doc(id).update({
    status,
    updatedAt: new Date(),
  });
}

export async function createCategoryServer(name: string) {
  if (!adminDb) throw new Error('Database not initialized');
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const docRef = await adminDb.collection('categories').add({
    name,
    slug,
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function deleteCategoryServer(id: string) {
  if (!adminDb) throw new Error('Database not initialized');
  await adminDb.collection('categories').doc(id).delete();
}
