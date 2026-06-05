import { Metadata } from 'next';
import { getProductsServer, getCategoriesServer } from '@/lib/firebase/firestore-admin';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: "Premium Products Catalog | Helima",
  description: "Browse our exclusive catalog of curated garments, designer jackets, luxury streetwear hoodies, minimal jewelry, premium shoes, and high-fashion lifestyle accessories.",
  keywords: [
    "premium catalog",
    "shop designer jackets",
    "buy luxury streetwear online",
    "minimal jewelry accessories",
    "exclusive shoes sneakers",
    "high fashion boutique collection",
    "curated garments lifestyle",
    "imported luxury apparel",
    "urban fashion outfits"
  ]
};

export default async function Page() {
  const [products, categories] = await Promise.all([
    getProductsServer(),
    getCategoriesServer()
  ]);

  return <ProductsClient initialProducts={products} initialCategories={categories} />;
}
