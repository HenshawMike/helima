'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Product } from '@/lib/firebase/firestore';

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = () => {
    addItem({ ...product, quantity });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-[var(--white)] min-h-screen pt-8 md:pt-12 pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-8">
            <Breadcrumbs 
              items={[
                { label: 'Products', href: '/products' },
                { label: product.category, href: `/categories/${product.category.toLowerCase()}` },
                { label: product.name }
              ]} 
            />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Image Column */}
          <ScrollReveal direction="in">
            <div className="w-full aspect-square border-2 border-[var(--navy)] relative overflow-hidden bg-gray-100">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <img 
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover max-md:grayscale-0 md:grayscale hover:grayscale-0 transition-all duration-700 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </ScrollReveal>

          {/* Details Column */}
          <div className="flex flex-col">
            <ScrollReveal delay={100}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-1 bg-[var(--gold)]"></div>
                <span className="font-bold text-sm tracking-widest uppercase text-[var(--navy)]">{product.category}</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-[var(--navy)] leading-none mb-5 md:mb-8">
                {product.name}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="border-t-4 border-[var(--navy)] py-4 md:py-6 mb-6 md:mb-8">
                <span className="text-3xl md:text-4xl font-black text-[var(--navy)]">
                  ₦{product.price.toFixed(2)}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <p className="text-[var(--navy)] text-base md:text-lg leading-relaxed font-medium mb-8 md:mb-12">
                {product.description}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 text-left">
                <div className="flex border-2 border-[var(--navy)]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-[var(--navy)] font-bold hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors"
                  >
                    -
                  </button>
                  <div className="w-12 md:w-16 h-10 md:h-12 flex items-center justify-center text-[var(--navy)] font-black text-lg md:text-xl border-x-2 border-[var(--navy)]">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-[var(--navy)] font-bold hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-[var(--navy)] font-bold uppercase tracking-widest text-sm">
                  Quantity
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full bg-[var(--navy)] text-[var(--white)] py-4 md:py-6 font-black uppercase tracking-widest text-base md:text-lg border-2 border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)] transition-all relative overflow-hidden"
              >
                {isAdded ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
