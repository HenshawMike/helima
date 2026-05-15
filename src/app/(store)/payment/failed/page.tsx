'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function PaymentFailedPage() {
  return (
    <div className="bg-[var(--white)] min-h-screen pt-32 pb-32 flex flex-col items-center justify-center text-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6 w-full">
        <ScrollReveal>
          <div className="w-24 h-24 border-4 border-[var(--red)] rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-[var(--red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="text-5xl md:text-6xl font-black text-[var(--navy)] tracking-tighter uppercase mb-6">
            Payment Failed
          </h1>
          <p className="text-[var(--navy)] text-lg font-medium mb-12">
            Unfortunately, we couldn't process your payment. Your cart has been saved, and no charges were made.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              href="/checkout" 
              className="bg-[var(--navy)] text-[var(--white)] px-8 py-4 font-black uppercase tracking-widest text-sm border-2 border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)] transition-colors"
            >
              Try Again
            </Link>
            <a 
              href="https://wa.me/1234567890?text=I%20need%20help%20with%20my%20payment%20on%20Helima" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--white)] text-[var(--navy)] px-8 py-4 font-black uppercase tracking-widest text-sm border-2 border-[var(--navy)] hover:text-[var(--red)] hover:border-[var(--red)] transition-colors"
            >
              Contact Support
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
