import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';
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
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching products:', error);
    return PRODUCTS;
  }
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
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return FEATURED_PRODUCTS;
  }
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
