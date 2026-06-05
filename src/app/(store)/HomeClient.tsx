'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProductCard from '@/components/store/ProductCard';
import { Product } from '@/lib/firebase/firestore';
import { useAuth } from '@/context/AuthContext';

interface HomeClientProps {
  initialProducts: Product[];
}

export default function HomeClient({ initialProducts }: HomeClientProps) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--white)] selection:bg-[var(--navy)] selection:text-[var(--white)]">
      {/* Hero Section with Background Image */}
      <section className="relative bg-[var(--navy)] text-[var(--white)] pt-16 pb-16 md:pt-24 md:pb-24 border-b-2 border-[var(--navy)] overflow-hidden">
        {/* Background Image with Navy Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero_background.png')" }}
        />
        {/* Navy Overlay - low opacity */}
        <div className="absolute inset-0 bg-[var(--navy)] opacity-80" />
        
        {/* Content - relative to stay above overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center gap-8 md:gap-12">
            <div className="max-w-2xl flex flex-col items-center">
              <ScrollReveal delay={300}>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-1 md:mb-3 uppercase">
                  Curated <br />
                  Imports
                </h1>
              </ScrollReveal>
              
              <ScrollReveal delay={500}>
                <p className="text-md md:text-lg lg:text-xl max-w-md leading-tight font-medium opacity-90 mb-8 md:mb-12">
                  Exceptional goods sourced globally. Delivered directly to you with uncompromising standards.
                </p>
              </ScrollReveal>
              
              <ScrollReveal delay={700}>
                <div className="flex justify-center gap-4 md:gap-6">
                  <Link 
                    href="/products" 
                    className="bg-[var(--white)] text-[var(--navy)] px-8 py-4 md:px-10 md:py-5 font-black uppercase tracking-widest text-sm md:text-base transition-transform hover:translate-x-1"
                  >
                    View Catalog
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Strict Minimal Features */}
      <div className="bg-[var(--white)] border-b-2 border-[var(--navy)] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            <ScrollReveal delay={300}>
              <div className="border-l-4 border-[var(--navy)] pl-6">
                <div className="text-[var(--navy)] font-black text-base md:text-xl mb-1 md:mb-2 uppercase tracking-widest">Quality</div>
                <p className="text-[var(--navy)] opacity-80 text-sm uppercase tracking-wide">Verified origin</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <div className="border-l-4 border-[var(--navy)] pl-6">
                <div className="text-[var(--navy)] font-black text-base md:text-xl mb-1 md:mb-2 uppercase tracking-widest">Secure</div>
                <p className="text-[var(--navy)] opacity-80 text-sm uppercase tracking-wide">Encrypted transactions</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={500}>
              <div className="border-l-4 border-[var(--gold)] pl-6">
                <div className="text-[var(--navy)] font-black text-base md:text-xl mb-1 md:mb-2 uppercase tracking-widest">Support</div>
                <p className="text-[var(--navy)] opacity-80 text-sm uppercase tracking-wide">Direct access</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-12 md:py-20 bg-[var(--white)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-20 gap-6 md:gap-8 border-b-2 border-[var(--navy)] pb-2 md:pb-6">
              <Link 
                href="/products" 
                className="text-[var(--navy)] font-black hover:text-[var(--gold)] transition-colors uppercase tracking-widest text-sm flex items-center gap-4"
              >
                <h2 className="text-2xl md:text-4xl font-black text-[var(--navy)] tracking-tighter uppercase">
                  All Products</h2>
                <div className="w-8 h-0.5 bg-current"></div>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {initialProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 150}>
                <ProductCard {...product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Description Content Block */}
      <section className="py-12 md:py-16 bg-gray-50 border-t-2 border-[var(--navy)] text-[var(--navy)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left">
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest mb-4">Helima Premium E-Commerce</h3>
                <p className="text-xs leading-relaxed opacity-80">
                  Welcome to Helima, the ultimate destination for luxury boutique clothing, high-fashion apparel, and imported designer goods. We curate premium collections for customers seeking uncompromising quality and contemporary style.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest mb-4">Curated Designer Goods</h3>
                <p className="text-xs leading-relaxed opacity-80">
                  Explore our carefully selected garments, custom streetwear jackets, designer shoes, luxury bags, and minimal jewelry accessories. Sourced from global style hubs, we connect you with authentic international imports delivered with premium service.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest mb-4">Secure Premium Shopping</h3>
                <p className="text-xs leading-relaxed opacity-80">
                  Shop luxury apparel with confidence. We offer fully encrypted transactions, direct customer support channels, verified origins on every product, and fast domestic and global shipping, ensuring a seamless checkout process.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 bg-[var(--navy)] text-[var(--white)] border-t-2 border-[var(--navy)] max-h-[800px] flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <ScrollReveal>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-[var(--gold)] mx-auto mb-6 md:mb-10"></div>
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase mb-5 md:mb-8 leading-none">
              Elevate <br />
              Your Standard
            </h2>
            <p className="text-sm md:text-lg opacity-70 font-medium mb-8 md:mb-12 max-w-xl mx-auto uppercase tracking-widest">
              Settle for nothing less than absolute quality.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={300}>
            {user ? (
              <Link 
                href="/profile" 
                className="inline-block bg-[var(--white)] text-[var(--navy)] px-8 py-3 md:px-12 md:py-5 font-black uppercase tracking-widest text-xs md:text-sm hover:bg-[var(--gold)] hover:text-[var(--white)] border-2 border-[var(--white)] transition-colors"
              >
                View Account
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="inline-block bg-[var(--white)] text-[var(--navy)] px-8 py-3 md:px-12 md:py-5 font-black uppercase tracking-widest text-xs md:text-sm hover:bg-[var(--gold)] border-2 border-[var(--white)] transition-colors"
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