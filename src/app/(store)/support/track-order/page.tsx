'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<null | 'not_found' | 'processing'>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder logic
    if (orderId.trim()) {
      setStatus('not_found');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--white)] py-20 selection:bg-[var(--navy)] selection:text-[var(--white)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="border-b-2 border-[var(--navy)] pb-8 mb-12">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Track <br /> Order
            </h1>
            <p className="text-[var(--navy)] opacity-60 uppercase tracking-widest text-sm font-bold mt-4">
              Real-time Acquisition Status
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <ScrollReveal delay={200}>
            <form onSubmit={handleTrack} className="space-y-8">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold mb-4">Order ID</label>
                <input 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="HLM-XXXXXX"
                  className="w-full bg-[var(--white)] border-2 border-[var(--navy)] p-4 font-bold uppercase tracking-widest text-sm focus:bg-[var(--navy)] focus:text-[var(--white)] transition-all outline-none"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[var(--navy)] text-[var(--white)] py-5 font-black uppercase tracking-widest text-sm hover:bg-[var(--gold)] transition-colors border-2 border-[var(--navy)]"
              >
                Trace Order
              </button>
            </form>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="h-full border-2 border-[var(--navy)] border-dashed p-8 flex flex-col items-center justify-center text-center">
              {!status ? (
                <>
                  <div className="w-12 h-12 border-2 border-[var(--navy)] flex items-center justify-center mb-6 opacity-30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-[var(--navy)] font-black uppercase tracking-widest text-xs opacity-40">Enter your ID to see status</p>
                </>
              ) : status === 'not_found' ? (
                <div className="reveal-up is-visible">
                  <div className="w-12 h-12 border-2 border-red-600 flex items-center justify-center mx-auto mb-6">
                    <span className="text-red-600 font-bold">!</span>
                  </div>
                  <h3 className="text-xl font-black text-[var(--navy)] uppercase mb-2">Not Found</h3>
                  <p className="text-xs font-bold text-[var(--navy)] opacity-60 uppercase tracking-widest leading-relaxed">
                    We couldn't locate that order ID. Please verify the ID or contact support.
                  </p>
                </div>
              ) : null}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
