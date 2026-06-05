'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Category, Product } from '@/lib/firebase/firestore';

interface CategoriesClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

export default function CategoriesClient({ initialCategories, initialProducts }: CategoriesClientProps) {
  const getProductCount = (categorySlug: string) => {
    return initialProducts.filter(p => p.category === categorySlug).length;
  };

  return (
    <div className="bg-[var(--white)] min-h-screen pt-16 md:pt-24 pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="text-2xl md:text-4xl font-black text-[var(--navy)] tracking-tighter uppercase mb-10 md:mb-16 border-b-4 border-[var(--navy)] pb-6 md:pb-8">
            Categories
          </h1>
        </ScrollReveal>

        {initialCategories.length === 0 ? (
          <ScrollReveal>
            <div className="border-4 border-[var(--navy)] p-8 md:p-16 text-center">
              <h2 className="text-2xl md:text-3xl font-black text-[var(--navy)] uppercase mb-4">No Categories Found</h2>
              <p className="text-[var(--navy)] opacity-70 font-medium">Please add categories through the admin panel dashboard.</p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {initialCategories.map((category, index) => {
              const productCount = getProductCount(category.slug);
              return (
                <ScrollReveal key={category.slug} delay={index * 100}>
                  <Link 
                    href={`/categories/${category.slug}`}
                    className="group block border-4 border-[var(--navy)] p-5 md:p-8 hover:bg-[var(--navy)] transition-colors bg-white"
                  >
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-xl md:text-3xl font-black text-[var(--navy)] group-hover:text-[var(--white)] uppercase tracking-tighter transition-colors break-normal mb-2">
                          {category.name}
                        </h2>
                        <span className="text-xs uppercase tracking-widest font-bold text-[var(--navy)] opacity-60 group-hover:text-[var(--white)] group-hover:opacity-85 transition-colors">
                          {productCount} {productCount === 1 ? 'Product' : 'Products'}
                        </span>
                      </div>
                      <span className="text-[var(--navy)] group-hover:text-[var(--gold)] font-bold text-xl transition-colors">
                        &rarr;
                      </span>
                    </div>
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
