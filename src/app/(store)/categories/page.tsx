'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', count: 12 },
  { name: 'Fashion', slug: 'fashion', count: 8 },
  { name: 'Home', slug: 'home', count: 15 },
  { name: 'Furniture', slug: 'furniture', count: 6 },
  { name: 'Kitchen', slug: 'kitchen', count: 9 },
];

export default function CategoriesPage() {
  return (
    <div className="bg-[var(--white)] min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="text-5xl md:text-7xl font-black text-[var(--navy)] tracking-tighter uppercase mb-16 border-b-4 border-[var(--navy)] pb-8">
            Categories
          </h1>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((category, index) => (
            <ScrollReveal key={category.slug} delay={index * 100}>
              <Link 
                href={`/categories/${category.slug}`}
                className="group block border-4 border-[var(--navy)] p-8 hover:bg-[var(--navy)] transition-colors"
              >
                <div className="flex justify-between items-end">
                  <h2 className="text-3xl font-black text-[var(--navy)] group-hover:text-[var(--white)] uppercase tracking-tighter transition-colors">
                    {category.name}
                  </h2>
                  <span className="text-[var(--navy)] group-hover:text-[var(--red)] font-bold text-xl transition-colors">
                    &rarr;
                  </span>
                </div>
                <p className="mt-4 text-[var(--navy)] group-hover:text-[var(--white)] opacity-80 uppercase tracking-widest text-xs font-bold transition-colors">
                  {category.count} Products
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
