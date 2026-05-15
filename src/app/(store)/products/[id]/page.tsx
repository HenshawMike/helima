'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/firebase/firestore';
import { Product } from '@/lib/dummy-data';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id).then(p => {
      if (!p) {
        notFound();
      } else {
        setProduct(p);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[var(--white)] pt-32 text-center text-[var(--navy)] font-bold">Loading...</div>;
  if (!product) return null;

  const handleAddToCart = () => {
    addItem({ ...product, quantity });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-[var(--white)] min-h-screen pt-12 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-12">
            <Link href="/products" className="text-[var(--navy)] font-bold uppercase tracking-widest text-sm hover:text-[var(--gold)] transition-colors flex items-center gap-2">
              <span>&larr;</span> Back to Catalog
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Column */}
          <ScrollReveal direction="in">
            <div className="w-full aspect-square border-2 border-[var(--navy)] relative overflow-hidden bg-[var(--white)]">
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
                style={{ backgroundImage: `url(${product.imageUrl})` }}
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
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-[var(--navy)] leading-none mb-8">
                {product.name}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="border-t-4 border-[var(--navy)] py-6 mb-8">
                <span className="text-4xl font-black text-[var(--navy)]">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <p className="text-[var(--navy)] text-lg leading-relaxed font-medium mb-12">
                {product.description}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="flex items-center gap-6 mb-8">
                <div className="flex border-2 border-[var(--navy)]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-[var(--navy)] font-bold hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors"
                  >
                    -
                  </button>
                  <div className="w-16 h-12 flex items-center justify-center text-[var(--navy)] font-black text-xl border-x-2 border-[var(--navy)]">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-[var(--navy)] font-bold hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors"
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
                className="w-full bg-[var(--navy)] text-[var(--white)] py-6 font-black uppercase tracking-widest text-lg border-2 border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)] transition-all relative overflow-hidden"
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
