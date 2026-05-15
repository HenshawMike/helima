'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function LoginPage() {
  return (
    <div className="bg-[var(--white)] min-h-screen pt-32 pb-32 flex flex-col items-center justify-center">
      <div className="max-w-md w-full px-4 sm:px-6">
        <ScrollReveal>
          <div className="border-4 border-[var(--navy)] p-12 text-center">
            <h1 className="text-4xl font-black text-[var(--navy)] tracking-tighter uppercase mb-2">
              Sign In
            </h1>
            <p className="text-[var(--navy)] opacity-80 font-medium mb-12 uppercase tracking-widest text-xs">
              Access your Helima account
            </p>

            {/* Google Sign In Button Scaffold */}
            <button className="w-full bg-[var(--white)] text-[var(--navy)] py-4 font-black uppercase tracking-widest text-sm border-2 border-[var(--navy)] hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors flex items-center justify-center gap-3 mb-6">
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-[var(--navy)] text-xs font-bold mt-8">
              No separate signup required.
            </p>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={200}>
          <div className="mt-8 text-center">
            <Link href="/" className="text-[var(--navy)] font-bold uppercase tracking-widest text-xs hover:text-[var(--red)] transition-colors underline">
              Return to Store
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
