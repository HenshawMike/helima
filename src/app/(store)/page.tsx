'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProductCard from '@/components/store/ProductCard';
import { getFeaturedProducts } from '@/lib/firebase/firestore';
import { Product } from '@/lib/dummy-data';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    getFeaturedProducts().then(setFeaturedProducts);
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-[var(--white)] selection:bg-[var(--navy)] selection:text-[var(--white)]">
      {/* Hero Section */}
      <section className="bg-[var(--navy)] text-[var(--white)] pt-20 pb-20 border-b-2 border-[var(--navy)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div className="max-w-2xl">
              <ScrollReveal delay={300}>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8 uppercase">
                  Curated <br />
                  Imports
                </h1>
              </ScrollReveal>
              
              <ScrollReveal delay={500}>
                <p className="text-lg max-w-md leading-relaxed font-medium opacity-90 mb-12">
                  Exceptional goods sourced globally. Delivered directly to you with uncompromising standards.
                </p>
              </ScrollReveal>
              
              <ScrollReveal delay={700}>
                <div className="flex flex-wrap gap-6">
                  <Link 
                    href="/products" 
                    className="bg-[var(--white)] text-[var(--navy)] px-8 py-4 font-black uppercase tracking-widest text-sm transition-transform hover:translate-x-1"
                  >
                    View Catalog
                  </Link>
                </div>
              </ScrollReveal>
            </div>
            
            <ScrollReveal delay={600} direction="right" className="hidden lg:block w-[400px]">
               <div className="w-full aspect-square border-2 border-[var(--white)] relative">
                  <div className="absolute top-4 left-4 w-full h-full border-2 border-[var(--white)] opacity-50"></div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center grayscale"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop)' }}
                  ></div>
               </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Strict Minimal Features */}
      <div className="bg-[var(--white)] border-b-2 border-[var(--navy)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ScrollReveal delay={100}>
              <div className="border-l-4 border-[var(--navy)] pl-6">
                <div className="text-[var(--navy)] font-black text-xl mb-2 uppercase tracking-widest">Quality</div>
                <p className="text-[var(--navy)] opacity-80 text-sm uppercase tracking-wide">Verified origin</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="border-l-4 border-[var(--navy)] pl-6">
                <div className="text-[var(--navy)] font-black text-xl mb-2 uppercase tracking-widest">Secure</div>
                <p className="text-[var(--navy)] opacity-80 text-sm uppercase tracking-wide">Encrypted transactions</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={500}>
              <div className="border-l-4 border-[var(--gold)] pl-6">
                <div className="text-[var(--navy)] font-black text-xl mb-2 uppercase tracking-widest">Support</div>
                <p className="text-[var(--navy)] opacity-80 text-sm uppercase tracking-wide">Direct access</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-20 bg-[var(--white)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b-2 border-[var(--navy)] pb-8">
              <h2 className="text-4xl md:text-6xl font-black text-[var(--navy)] tracking-tighter uppercase">
                Featured
              </h2>
              <Link 
                href="/products" 
                className="text-[var(--navy)] font-black hover:text-[var(--gold)] transition-colors uppercase tracking-widest text-sm flex items-center gap-4"
              >
                All Products
                <div className="w-8 h-0.5 bg-current"></div>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 150}>
                <ProductCard {...product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Restored to Strict Minimalist Style */}
      <section className="py-20 bg-[var(--navy)] text-[var(--white)] border-t-2 border-[var(--navy)] max-h-[800px] flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <ScrollReveal>
            <div className="w-4 h-4 bg-[var(--gold)] mx-auto mb-10"></div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 leading-none">
              Elevate <br />
              Your Standard
            </h2>
            <p className="text-lg opacity-70 font-medium mb-12 max-w-xl mx-auto uppercase tracking-widest">
              Settle for nothing less than absolute quality.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={300}>
            {user ? (
              <Link 
                href="/profile" 
                className="inline-block bg-[var(--white)] text-[var(--navy)] px-12 py-5 font-black uppercase tracking-widest text-sm hover:bg-[var(--gold)] hover:text-[var(--white)] border-2 border-[var(--white)] transition-colors"
              >
                View Account
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="inline-block bg-[var(--white)] text-[var(--navy)] px-12 py-5 font-black uppercase tracking-widest text-sm hover:bg-[var(--gold)] hover:text-[var(--white)] border-2 border-[var(--white)] transition-colors"
              >
                Sign In
              </Link>
            )}
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
