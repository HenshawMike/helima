'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProductCard from '@/components/store/ProductCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Product } from '@/lib/firebase/firestore';

interface CategoryDetailsClientProps {
  initialProducts: Product[];
  slug: string;
  subcategories: string[];
}

export default function CategoryDetailsClient({ initialProducts, slug, subcategories }: CategoryDetailsClientProps) {
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (!activeFilter) return initialProducts;
    return initialProducts.filter(p => p.subcategory === activeFilter);
  }, [initialProducts, activeFilter]);

  // Count products per subcategory for the badges
  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const sub of subcategories) {
      counts[sub] = initialProducts.filter(p => p.subcategory === sub).length;
    }
    return counts;
  }, [initialProducts, subcategories]);

  const hasSubcategories = subcategories.length > 0;

  return (
    <div className="bg-[var(--white)] min-h-screen pt-10 pb-22">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-6">
            <Breadcrumbs 
              items={[
                { label: 'Categories', href: '/categories' },
                { label: categoryName }
              ]} 
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-[var(--navy)] tracking-tighter uppercase mb-6 border-b-4 border-[var(--navy)] pb-8">
            {categoryName}
          </h1>
        </ScrollReveal>

        {/* Subcategory Filter Bar */}
        {hasSubcategories && (
          <ScrollReveal delay={100}>
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[var(--gold)]"></div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--navy)] opacity-50">
                  Filter by type
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* "All" filter chip */}
                <button
                  onClick={() => setActiveFilter(null)}
                  className={`px-4 py-2.5 text-[10px] md:text-xs font-black uppercase tracking-widest border-2 transition-all duration-300 ${
                    activeFilter === null
                      ? 'bg-[var(--navy)] text-[var(--white)] border-[var(--navy)] shadow-[3px_3px_0_0_var(--gold)]'
                      : 'bg-[var(--white)] text-[var(--navy)] border-[var(--navy)] hover:bg-[var(--navy)] hover:text-[var(--white)]'
                  }`}
                >
                  All
                  <span className={`ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[9px] font-black rounded-none px-1 ${
                    activeFilter === null 
                      ? 'bg-[var(--gold)] text-[var(--navy)]' 
                      : 'bg-[var(--navy)] text-[var(--white)] opacity-40'
                  }`}>
                    {initialProducts.length}
                  </span>
                </button>

                {/* Subcategory filter chips */}
                {subcategories.map((sub) => {
                  const count = subcategoryCounts[sub] || 0;
                  const isActive = activeFilter === sub;
                  return (
                    <button
                      key={sub}
                      onClick={() => setActiveFilter(isActive ? null : sub)}
                      className={`px-4 py-2.5 text-[10px] md:text-xs font-black uppercase tracking-widest border-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-[var(--navy)] text-[var(--white)] border-[var(--navy)] shadow-[3px_3px_0_0_var(--gold)]'
                          : 'bg-[var(--white)] text-[var(--navy)] border-[var(--navy)] hover:bg-[var(--navy)] hover:text-[var(--white)]'
                      }`}
                    >
                      {sub}
                      <span className={`ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[9px] font-black rounded-none px-1 ${
                        isActive 
                          ? 'bg-[var(--gold)] text-[var(--navy)]' 
                          : 'bg-[var(--navy)] text-[var(--white)] opacity-40'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Active filter indicator */}
        {activeFilter && (
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--navy)] opacity-60">
                Showing: {activeFilter}
              </span>
              <button
                onClick={() => setActiveFilter(null)}
                className="text-[10px] font-black uppercase tracking-widest text-red-600 border-b border-red-600 hover:text-[var(--navy)] hover:border-[var(--navy)] transition-colors"
              >
                Clear filter
              </button>
            </div>
          </ScrollReveal>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-4">
            {filteredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 100}>
                <ProductCard {...product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal delay={200}>
            <div className="border-4 border-[var(--navy)] p-16 text-center mt-12">
              {activeFilter ? (
                <>
                  <h2 className="text-3xl font-black text-[var(--navy)] uppercase mb-6">No Products Found</h2>
                  <p className="text-[var(--navy)] font-medium mb-8">
                    There are no products in the &ldquo;{activeFilter}&rdquo; subcategory yet.
                  </p>
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="inline-block bg-[var(--navy)] text-[var(--white)] px-8 py-4 font-black uppercase tracking-widest text-sm border-2 border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)] transition-colors"
                  >
                    View All {categoryName}
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-[var(--navy)] uppercase mb-6">No Products Found</h2>
                  <p className="text-[var(--navy)] font-medium mb-8">There are currently no products available in the {categoryName} category.</p>
                  <Link 
                    href="/products" 
                    className="inline-block bg-[var(--navy)] text-[var(--white)] px-8 py-4 font-black uppercase tracking-widest text-sm border-2 border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)] transition-colors"
                  >
                    View All Products
                  </Link>
                </>
              )}
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
