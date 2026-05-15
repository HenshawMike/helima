'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useState } from 'react';

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [step, setStep] = useState(1);

  return (
    <div className="bg-[var(--white)] min-h-screen pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-2 bg-[var(--navy)]"></div>
            <h1 className="text-5xl md:text-7xl font-black text-[var(--navy)] tracking-tighter uppercase">
              Checkout
            </h1>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <ScrollReveal delay={100}>
              <div className="mb-12 border-4 border-[var(--navy)] p-8">
                <div className="flex items-center justify-between mb-8 border-b-2 border-[var(--navy)] pb-4">
                  <h2 className="text-2xl font-black text-[var(--navy)] uppercase tracking-widest">1. Contact & Shipping</h2>
                  <span className="text-[var(--gold)] font-bold text-sm uppercase">Pending</span>
                </div>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[var(--navy)] font-bold uppercase tracking-widest text-xs mb-2">First Name</label>
                      <input type="text" className="w-full border-2 border-[var(--navy)] p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium" />
                    </div>
                    <div>
                      <label className="block text-[var(--navy)] font-bold uppercase tracking-widest text-xs mb-2">Last Name</label>
                      <input type="text" className="w-full border-2 border-[var(--navy)] p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[var(--navy)] font-bold uppercase tracking-widest text-xs mb-2">Email</label>
                    <input type="email" className="w-full border-2 border-[var(--navy)] p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium" />
                  </div>
                  
                  <div>
                    <label className="block text-[var(--navy)] font-bold uppercase tracking-widest text-xs mb-2">Address</label>
                    <input type="text" className="w-full border-2 border-[var(--navy)] p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium" />
                  </div>

                  <div className="pt-6">
                    <button type="button" onClick={() => setStep(2)} className="bg-[var(--navy)] text-[var(--white)] px-8 py-4 font-black uppercase tracking-widest text-sm border-2 border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)] transition-colors">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className={`border-4 border-[var(--navy)] p-8 ${step < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center justify-between mb-8 border-b-2 border-[var(--navy)] pb-4">
                  <h2 className="text-2xl font-black text-[var(--navy)] uppercase tracking-widest">2. Payment</h2>
                  <span className="text-[var(--navy)] font-bold text-sm uppercase">Secure</span>
                </div>
                
                {step >= 2 && (
                  <div className="space-y-6">
                    <p className="text-[var(--navy)] font-medium mb-6">This is a demo. In a real app, Stripe/Paystack elements would appear here.</p>
                    
                    <Link href="/payment/success" className="block text-center w-full bg-[var(--gold)] text-[var(--white)] py-5 font-black uppercase tracking-widest text-sm border-2 border-[var(--gold)] hover:bg-[var(--navy)] hover:border-[var(--navy)] transition-colors">
                      Pay ${(totalPrice).toFixed(2)}
                    </Link>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
          
          <div className="lg:col-span-1">
            <ScrollReveal delay={300} direction="right">
              <div className="border-4 border-[var(--navy)] p-8 sticky top-24">
                <h3 className="text-2xl font-black text-[var(--navy)] uppercase mb-8 border-b-2 border-[var(--navy)] pb-4 tracking-widest">Order</h3>
                
                <div className="space-y-6 mb-8 max-h-64 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 border-2 border-[var(--navy)] flex-shrink-0 bg-cover bg-center grayscale" style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
                      <div>
                        <h4 className="font-bold text-[var(--navy)] uppercase text-sm leading-tight">{item.name}</h4>
                        <div className="text-[var(--navy)] text-xs font-bold mt-1">QTY: {item.quantity} × ${item.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t-2 border-[var(--navy)] pt-6 mb-8 flex justify-between items-end">
                  <span className="uppercase text-sm tracking-widest font-bold text-[var(--navy)]">Total</span>
                  <span className="text-3xl font-black text-[var(--navy)]">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
