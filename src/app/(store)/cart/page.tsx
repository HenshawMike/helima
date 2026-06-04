'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ui/ScrollReveal';

function CartItemImage({ imageUrl, name }: { imageUrl: string, name: string }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-[var(--navy)] flex-shrink-0 relative overflow-hidden bg-gray-100">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img 
        src={imageUrl} 
        alt={name}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover max-md:grayscale-0 md:grayscale transition-all duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  return (
    <div className="bg-[var(--white)] min-h-screen pt-10 md:pt-16 pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
            <div className="w-8 md:w-12 h-1.5 md:h-2 bg-[var(--gold)]"></div>
            <h1 className="text-3xl md:text-7xl font-black text-[var(--navy)] tracking-tighter uppercase">
              Your Cart
            </h1>
          </div>
        </ScrollReveal>

        {items.length === 0 ? (
          <ScrollReveal delay={200}>
            <div className="border-4 border-[var(--navy)] p-8 md:p-16 text-center">
              <h2 className="text-2xl md:text-3xl font-black text-[var(--navy)] uppercase mb-4 md:mb-6">Cart is Empty</h2>
              <p className="text-[var(--navy)] font-medium mb-6 md:mb-8 text-sm md:text-base">You haven't added any premium goods to your cart yet.</p>
              <Link 
                href="/products" 
                className="inline-block bg-[var(--navy)] text-[var(--white)] px-6 py-3 md:px-8 md:py-4 font-black uppercase tracking-widest text-xs md:text-sm border-2 border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)] transition-colors"
              >
                Explore Catalog
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
            <div className="lg:col-span-2">
              <div className="border-t-4 border-[var(--navy)]">
                {items.map((item, index) => (
                  <ScrollReveal key={item.id} delay={index * 100}>
                    <div className="flex flex-row gap-4 md:gap-6 py-6 md:py-8 border-b-2 border-[var(--navy)] items-start">
                      <CartItemImage imageUrl={item.imageUrl} name={item.name} />
                      
                      <div className="flex-grow flex flex-col justify-between min-h-[96px] md:min-h-[128px]">
                        <div className="flex justify-between items-start w-full gap-2">
                          <div>
                            <h3 className="text-sm md:text-2xl font-black text-[var(--navy)] uppercase leading-tight mb-1 md:mb-2">{item.name}</h3>
                            <div className="text-[var(--navy)] font-bold text-xs md:text-base">₦{item.price.toFixed(2)} each</div>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-[var(--navy)] hover:text-[var(--gold)] font-bold uppercase tracking-widest text-[10px] md:text-xs underline flex-shrink-0 pt-0.5"
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 md:mt-6">
                          <div className="flex border-2 border-[var(--navy)]">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 md:w-10 h-7 md:h-10 flex items-center justify-center text-[var(--navy)] font-bold hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors"
                            >
                              -
                            </button>
                            <div className="w-8 md:w-12 h-7 md:h-10 flex items-center justify-center text-[var(--navy)] font-black border-x-2 border-[var(--navy)] text-xs md:text-base">
                              {item.quantity}
                            </div>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 md:w-10 h-7 md:h-10 flex items-center justify-center text-[var(--navy)] font-bold hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-sm md:text-2xl font-black text-[var(--navy)]">
                            ₦{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <ScrollReveal delay={300} direction="right">
                <div className="bg-[var(--navy)] text-[var(--white)] p-5 md:p-8 border-4 border-[var(--navy)] relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--white)] flex items-center justify-center">
                    <div className="w-4 h-4 bg-[var(--gold)]"></div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-black uppercase mb-6 md:mb-8 border-b-2 border-[var(--white)] pb-3 md:pb-4 tracking-widest">Order Summary</h3>
                  
                  <div className="space-y-4 mb-8 font-medium">
                    <div className="flex justify-between">
                      <span className="uppercase text-sm tracking-widest">Subtotal</span>
                      <span className="font-bold">₦{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="uppercase text-sm tracking-widest">Shipping</span>
                      <span className="font-bold uppercase text-xs">Calculated next</span>
                    </div>
                  </div>
                  
                  <div className="border-t-2 border-[var(--white)] pt-6 mb-8 flex justify-between items-end">
                    <span className="uppercase text-sm tracking-widest">Total</span>
                    <span className="text-3xl md:text-4xl font-black">₦{totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <Link 
                    href="/checkout" 
                    className="block text-center w-full bg-[var(--white)] text-[var(--navy)] py-3.5 md:py-5 font-black uppercase tracking-widest text-xs md:text-sm hover:bg-[var(--gold)] hover:text-[var(--white)] hover:border-[var(--gold)] border-2 border-[var(--white)] transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
