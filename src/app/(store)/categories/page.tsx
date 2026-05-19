'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getCategories, getProducts, Category } from '@/lib/firebase/firestore';
import { Product } from '@/lib/dummy-data';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        setCategories(cats);
        setProducts(prods);
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getProductCount = (categorySlug: string) => {
    return products.filter(p => p.category === categorySlug).length;
  };

  if (loading) {
    return (
      <div className="bg-[var(--white)] min-h-screen pt-32 text-center text-[var(--navy)] font-bold uppercase tracking-widest text-sm animate-pulse">
        Retrieving Categories...
      </div>
    );
  }

  return (
    <div className="bg-[var(--white)] min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="text-5xl md:text-7xl font-black text-[var(--navy)] tracking-tighter uppercase mb-16 border-b-4 border-[var(--navy)] pb-8">
            Categories
          </h1>
        </ScrollReveal>

        {categories.length === 0 ? (
          <ScrollReveal>
            <div className="border-4 border-[var(--navy)] p-16 text-center">
              <h2 className="text-3xl font-black text-[var(--navy)] uppercase mb-4">No Categories Found</h2>
              <p className="text-[var(--navy)] opacity-70 font-medium">Please add categories through the admin panel dashboard.</p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const count = getProductCount(category.slug);
              return (
                <ScrollReveal key={category.slug} delay={index * 100}>
                  <Link 
                    href={`/categories/${category.slug}`}
                    className="group block border-4 border-[var(--navy)] p-8 hover:bg-[var(--navy)] transition-colors bg-white"
                  >
                    <div className="flex justify-between items-end">
                      <h2 className="text-3xl font-black text-[var(--navy)] group-hover:text-[var(--white)] uppercase tracking-tighter transition-colors break-words max-w-[80%]">
                        {category.name}
                      </h2>
                      <span className="text-[var(--navy)] group-hover:text-[var(--gold)] font-bold text-xl transition-colors">
                        &rarr;
                      </span>
                    </div>
                    <p className="mt-4 text-[var(--navy)] group-hover:text-[var(--white)] opacity-80 uppercase tracking-widest text-xs font-bold transition-colors">
                      {count} {count === 1 ? 'Product' : 'Products'}
                    </p>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
