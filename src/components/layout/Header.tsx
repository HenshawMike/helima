'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    if (totalItems <= 0) {
      setShouldShake(false);
      return;
    }

    // Occasionally trigger shake animation
    const interval = setInterval(() => {
      setShouldShake(true);
      const timer = setTimeout(() => {
        setShouldShake(false);
      }, 820);
      return () => clearTimeout(timer);
    }, 2500);

    return () => clearInterval(interval);
  }, [totalItems]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--white)] border-b-2 border-[var(--navy)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-lg md:text-2xl tracking-tighter text-[var(--navy)] flex items-center gap-2 md:gap-3 uppercase">
              <img src="/helima.png" alt="Helima" className="w-9 h-9 md:w-14 md:h-14 object-contain" />
              HELIMA
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-[var(--navy)] hover:text-[var(--gold)] font-bold transition-colors uppercase text-sm tracking-widest">Home</Link>
            <Link href="/products" className="text-[var(--navy)] hover:text-[var(--gold)] font-bold transition-colors uppercase text-sm tracking-widest">Shop</Link>
            <Link href="/categories" className="text-[var(--navy)] hover:text-[var(--gold)] font-bold transition-colors uppercase text-sm tracking-widest">Categories</Link>
          </nav>
          <div className="flex items-center space-x-3 md:space-x-6">
            <Link 
              href="/cart" 
              className={`text-[var(--navy)] hover:text-[var(--gold)] relative transition-colors group ${
                shouldShake ? 'animate-shake' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--gold)] text-[var(--white)] text-[10px] font-bold px-1.5 py-0.5 rounded-full group-hover:scale-110 transition-transform">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <Link href="/profile" className="flex items-center gap-3 group">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50 leading-none mb-1">Account</span>
                  <span className="text-xs font-black text-[var(--navy)] uppercase tracking-tight group-hover:text-[var(--gold)] transition-colors">
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-[var(--navy)] flex-shrink-0 flex items-center justify-center bg-[var(--white)] group-hover:bg-[var(--navy)] group-hover:text-[var(--white)] transition-all overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </Link>
            ) : (
              <Link href="/login" className="bg-[var(--navy)] text-[var(--white)] px-3 py-1.5 md:px-6 md:py-2 font-bold uppercase text-xs md:text-sm transition-all border-2 border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)]">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
