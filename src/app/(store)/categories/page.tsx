import { Metadata } from 'next';
import { getCategoriesServer, getProductsServer } from '@/lib/firebase/firestore-admin';
import CategoriesClient from './CategoriesClient';

export const metadata: Metadata = {
  title: "Shop By Category ",
  description: "Browse our collections of premium garments, designer apparel, luxury streetwear jackets, and lifestyle products curated by category at Helima.",
  keywords: [
    "clothing categories",
    "premium collections",
    "designer product groups",
    "lifestyle apparel categories",
    "shop street fashion categories",
    "exclusive product lines",
    "curated fashion sub-stores"
  ]
};

export default async function Page() {
  const [categories, products] = await Promise.all([
    getCategoriesServer(),
    getProductsServer()
  ]);

  return <CategoriesClient initialCategories={categories} initialProducts={products} />;
}
