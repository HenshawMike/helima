'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--white)] border-b-2 border-[var(--navy)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-2xl tracking-tighter text-[var(--navy)] flex items-center gap-2 uppercase">
              <span className="w-8 h-8 bg-[var(--navy)] text-[var(--white)] flex items-center justify-center font-black">H</span>
              ELIMA
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-[var(--navy)] hover:text-[var(--gold)] font-bold transition-colors uppercase text-sm tracking-widest">Home</Link>
            <Link href="/products" className="text-[var(--navy)] hover:text-[var(--gold)] font-bold transition-colors uppercase text-sm tracking-widest">Shop</Link>
            <Link href="/categories" className="text-[var(--navy)] hover:text-[var(--gold)] font-bold transition-colors uppercase text-sm tracking-widest">Categories</Link>
          </nav>
          <div className="flex items-center space-x-6">
            <Link href="/cart" className="text-[var(--navy)] hover:text-[var(--gold)] relative transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--gold)] text-[var(--white)] text-[10px] font-bold px-1.5 py-0.5 rounded-full group-hover:scale-110 transition-transform">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/login" className="bg-[var(--navy)] text-[var(--white)] px-6 py-2 font-bold uppercase text-sm transition-all border-2 border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)]">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
