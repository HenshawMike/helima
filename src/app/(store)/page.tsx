import { Metadata } from 'next';
import { getFeaturedProductsServer } from '@/lib/firebase/firestore-admin';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "Premium Fashion & Lifestyle Boutique | Helima",
  description: "Shop the finest curated imports, designer fashion, luxury streetwear apparel, and premium lifestyle accessories. Delivered with uncompromising standards and secure payments.",
  keywords: [
    "Helima boutique",
    "luxury clothing shop",
    "buy designer garments online",
    "premium imports fashion",
    "unisex designer streetwear",
    "high fashion boutique store",
    "contemporary style products",
    "buy upscale apparel online",
    "curated international goods",
    "high quality hoodies jackets",
    "exclusive lifestyle items",
    "secure luxury e-commerce"
  ]
};

export default async function Page() {
  // Fetch products on the server for faster load times and SEO crawling
  const featuredProducts = await getFeaturedProductsServer(4);

  return <HomeClient initialProducts={featuredProducts} />;
}
