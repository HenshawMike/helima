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
import { PRODUCTS, FEATURED_PRODUCTS, Product } from '@/lib/dummy-data';

export async function getProducts(): Promise<Product[]> {
  if (!db) return PRODUCTS;
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
    
    return products.length > 0 ? products : PRODUCTS;
  } catch (error) {
    console.error('Error fetching products:', error);
    return PRODUCTS;
  }
}

export async function getAdminProducts(): Promise<Product[]> {
  if (!db) return PRODUCTS;
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
    return PRODUCTS;
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
  if (!db) return PRODUCTS.find(p => p.id === id) || null;
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return PRODUCTS.find(p => p.id === id) || null;
  }
}

export async function getFeaturedProducts(count: number = 4): Promise<Product[]> {
  if (!db) return FEATURED_PRODUCTS;
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
    
    return products.length > 0 ? products : FEATURED_PRODUCTS;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return FEATURED_PRODUCTS;
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
  if (!db) return PRODUCTS.filter(p => p.category.toLowerCase() === categorySlug.toLowerCase());
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
    return PRODUCTS.filter(p => p.category.toLowerCase() === categorySlug.toLowerCase());
  }
}
