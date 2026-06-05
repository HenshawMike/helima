'use client';

import { useState } from 'react';
import ProductCard from '@/components/store/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Category, Product } from '@/lib/firebase/firestore';

interface ProductsClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export default function ProductsClient({ initialProducts, initialCategories }: ProductsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = selectedCategory === 'all'
    ? initialProducts
    : initialProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-[var(--white)] min-h-screen">
      {/* Header Section */}
      <section className="bg-[var(--white)] border-b-2 border-[var(--navy)] py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="text-2xl md:text-4xl font-black text-[var(--navy)] tracking-tighter uppercase mb-4 md:mb-6">
              All Products
            </h1>
            
            {/* Dynamic Filter Buttons */}
            <div className="flex flex-wrap gap-2 md:gap-3 border-t-2 border-[var(--navy)] pt-4 md:pt-6">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`font-bold uppercase tracking-widest text-[10px] md:text-xs border-2 border-[var(--navy)] px-3 py-2 md:px-5 md:py-2.5 transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[var(--navy)] text-[var(--white)]'
                    : 'text-[var(--navy)] bg-transparent hover:bg-[var(--navy)] hover:text-[var(--white)]'
                }`}
              >
                All
              </button>

              {initialCategories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`font-bold uppercase tracking-widest text-[10px] md:text-xs border-2 border-[var(--navy)] px-3 py-2 md:px-5 md:py-2.5 transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-[var(--navy)] text-[var(--white)]'
                      : 'text-[var(--navy)] bg-transparent hover:bg-[var(--navy)] hover:text-[var(--white)]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <ScrollReveal>
              <div className="border-4 border-[var(--navy)] p-8 md:p-16 text-center">
                <h2 className="text-2xl font-black text-[var(--navy)] uppercase mb-2">No Products</h2>
                <p className="text-[var(--navy)] opacity-70 font-medium uppercase tracking-wide text-xs">
                  There are no products listed under this category yet.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredProducts.map((product, index) => (
                <ScrollReveal key={product.id} delay={(index % 4) * 100}>
                  <ProductCard {...product} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
