import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { Product } from '@/lib/dummy-data';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

// ==========================================
// CATEGORIES COLLECTION HELPERS
// ==========================================

export async function getCategories(): Promise<Category[]> {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Category));
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(name: string) {
  if (!db) return;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return addDoc(collection(db, 'categories'), {
    name,
    slug,
    createdAt: serverTimestamp(),
  });
}

export async function deleteCategory(id: string) {
  if (!db) return;
  return deleteDoc(doc(db, 'categories', id));
}

// ==========================================
// PRODUCTS COLLECTION HELPERS
// ==========================================

export async function getProducts(): Promise<Product[]> {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'products'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getAdminProducts(): Promise<Product[]> {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return [];
  }
}

export async function createProduct(product: Omit<Product, 'id'>) {
  if (!db) return;
  return addDoc(collection(db, 'products'), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(id: string, product: Partial<Product>) {
  if (!db) return;
  const productRef = doc(db, 'products', id);
  return updateDoc(productRef, {
    ...product,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string) {
  if (!db) return;
  return deleteDoc(doc(db, 'products', id));
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!db) return null;
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}

export async function getFeaturedProducts(count: number = 4): Promise<Product[]> {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'products'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
    
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getOrders() {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function updateOrderStatus(id: string, status: string) {
  if (!db) return;
  const orderRef = doc(db, 'orders', id);
  return updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'products'),
      where('isActive', '==', true),
      where('category', '==', categorySlug),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}
