import { Metadata } from 'next';
import { getProductsByCategoryServer, getCategoryBySlugServer } from '@/lib/firebase/firestore-admin';
import CategoryDetailsClient from './CategoryDetailsClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `Shop ${categoryName} — Premium Curated Imports `,
    description: `Explore our exclusive selection of premium ${categoryName} garments, designer collections, and luxury lifestyle accessories. Sourced globally with uncompromising standards.`,
    keywords: [
      slug,
      categoryName,
      `Helima ${slug}`,
      `buy ${slug} online`,
      `premium ${slug}`,
      `designer ${slug} clothing`,
      `luxury ${slug} collections`,
      "curated imports"
    ]
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [products, category] = await Promise.all([
    getProductsByCategoryServer(slug),
    getCategoryBySlugServer(slug),
  ]);

  const subcategories = category?.subcategories || [];

  return (
    <CategoryDetailsClient
      initialProducts={products}
      slug={slug}
      subcategories={subcategories}
    />
  );
}
