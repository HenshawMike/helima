'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function TrackOrderClient() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderId.trim();
    if (!cleanId) return;

    setLoading(true);
    setError('');
    setStatus(null);

    try {
      const response = await fetch(`/api/orders/track?orderId=${encodeURIComponent(cleanId)}`);
      const data = await response.json();

      if (!response.ok) {
        setStatus('not_found');
      } else {
        setStatus(data);
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setError('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--white)] py-12 md:py-20 selection:bg-[var(--navy)] selection:text-[var(--white)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="border-b-2 border-[var(--navy)] pb-6 md:pb-8 mb-8 md:mb-12">
            <h1 className="text-3xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Track <br /> Order
            </h1>
            <p className="text-[var(--navy)] opacity-60 uppercase tracking-widest text-xs md:text-sm font-bold mt-3 md:mt-4">
              Real-time Acquisition Status
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <ScrollReveal delay={200}>
            <form onSubmit={handleTrack} className="space-y-8">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold mb-4 text-left">Order ID</label>
                <input 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. HLM-XXXXXX"
                  className="w-full bg-[var(--white)] border-2 border-[var(--navy)] p-3 md:p-4 font-bold uppercase tracking-widest text-xs md:text-sm focus:bg-[var(--navy)] focus:text-[var(--white)] transition-all outline-none"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--navy)] text-[var(--white)] py-3.5 md:py-5 font-black uppercase tracking-widest text-xs md:text-sm hover:bg-[var(--gold)] transition-colors border-2 border-[var(--navy)] disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Trace Order'}
              </button>
            </form>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="h-full border-2 border-[var(--navy)] border-dashed p-8 flex flex-col items-center justify-center text-center bg-white min-h-[300px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-[var(--navy)] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--navy)] opacity-50">Querying Database...</p>
                </div>
              ) : error ? (
                <div className="reveal-up is-visible">
                  <div className="w-12 h-12 border-2 border-[var(--gold)] flex items-center justify-center mx-auto mb-6">
                    <span className="text-[var(--gold)] font-bold">!</span>
                  </div>
                  <h3 className="text-xl font-black text-[var(--navy)] uppercase mb-2">Error</h3>
                  <p className="text-xs font-bold text-[var(--navy)] opacity-60 uppercase tracking-widest leading-relaxed">
                    {error}
                  </p>
                </div>
              ) : !status ? (
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
              ) : (
                <div className="reveal-up is-visible text-left w-full space-y-6">
                  <div className="border-b-2 border-[var(--navy)] pb-4">
                    <h3 className="text-xl font-black text-[var(--navy)] uppercase">Order Status</h3>
                    <p className="text-[10px] text-[var(--navy)] opacity-60 uppercase tracking-widest mt-1">ID: #{status.id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-black text-[var(--navy)] opacity-50 mb-1">State</div>
                      <div className="inline-block bg-[var(--navy)] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                        {status.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-black text-[var(--navy)] opacity-50 mb-1">Customer</div>
                      <div className="font-bold text-[var(--navy)] uppercase text-sm">{status.customerName}</div>
                    </div>
                  </div>
                  <div className="border-t border-[var(--navy)] border-dashed pt-4">
                    <div className="text-[10px] uppercase tracking-widest font-black text-[var(--navy)] opacity-50 mb-2">Details</div>
                    <p className="text-xs font-medium text-[var(--navy)] uppercase">
                      Placed on {new Date(status.createdAt).toLocaleDateString()} &bull; {status.itemsCount} item(s)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
