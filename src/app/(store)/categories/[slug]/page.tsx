'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProductCard, { ProductCardSkeleton } from '@/components/store/ProductCard';
import { getProductsByCategory, Product } from '@/lib/firebase/firestore';


export default function CategoryDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsByCategory(slug).then(products => {
      setCategoryProducts(products);
      setLoading(false);
    });
  }, [slug]);

  return (
    <div className="bg-[var(--white)] min-h-screen pt-10 pb-22">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-2">
            <Link href="/categories" className="text-[var(--navy)] font-bold uppercase tracking-widest text-sm hover:text-[var(--gold)] transition-colors flex items-center gap-2">
              <span>&larr;</span> All Categories
            </Link>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-[var(--navy)] tracking-tighter uppercase mb-6 border-b-4 border-[var(--navy)] pb-8">
            {categoryName}
          </h1>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-12">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-12">
            {categoryProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 100}>
                <ProductCard {...product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal delay={200}>
            <div className="border-4 border-[var(--navy)] p-16 text-center mt-12">
              <h2 className="text-3xl font-black text-[var(--navy)] uppercase mb-6">No Products Found</h2>
              <p className="text-[var(--navy)] font-medium mb-8">There are currently no products available in the {categoryName} category.</p>
              <Link 
                href="/products" 
                className="inline-block bg-[var(--navy)] text-[var(--white)] px-8 py-4 font-black uppercase tracking-widest text-sm border-2 border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)] transition-colors"
              >
                View All Products
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
