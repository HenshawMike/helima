import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductByIdServer } from '@/lib/firebase/firestore-admin';
import ProductDetailsClient from './ProductDetailsClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByIdServer(id);

  if (!product) {
    return {
      title: 'Product Not Found | Helima',
    };
  }

  const cleanDescription = product.description.substring(0, 155);

  return {
    title: `${product.name} — Premium Curated Imports | Helima`,
    description: cleanDescription,
    keywords: [
      product.name,
      product.category,
      "Helima",
      "buy " + product.name,
      "premium " + product.category,
      "designer clothing",
      "curated imports"
    ],
    openGraph: {
      title: `${product.name} — Premium Curated Imports | Helima`,
      description: cleanDescription,
      images: [
        {
          url: product.imageUrl,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Premium Curated Imports | Helima`,
      description: cleanDescription,
      images: [product.imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const product = await getProductByIdServer(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
