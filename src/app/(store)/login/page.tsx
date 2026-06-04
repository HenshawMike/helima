'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Router will push in useEffect
    } catch (error: any) {
      console.error('Failed to sign in', error);
      if (error?.code === 'auth/popup-closed-by-user') {
        alert('Sign-in cancelled. Please complete the Google authentication to sign in.');
      } else {
        alert('Sign in failed. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--white)] min-h-screen pt-20 md:pt-32 pb-20 md:pb-32 flex flex-col items-center justify-center animate-pulse">
        <div className="max-w-md w-full px-4 sm:px-6">
          <div className="border-4 border-gray-200 p-8 md:p-12 text-center bg-white">
            <div className="h-8 w-32 bg-gray-200 mx-auto mb-4 rounded" />
            <div className="h-4 w-48 bg-gray-200 mx-auto mb-8 rounded" />
            <div className="h-12 w-full bg-gray-200 rounded mb-6" />
            <div className="h-4 w-40 bg-gray-200 mx-auto rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--white)] min-h-screen pt-20 md:pt-32 pb-20 md:pb-32 flex flex-col items-center justify-center">
      <div className="max-w-md w-full px-4 sm:px-6">
        <ScrollReveal>
          <div className="border-4 border-[var(--navy)] p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-4xl font-black text-[var(--navy)] tracking-tighter uppercase mb-2">
              Sign In
            </h1>
            <p className="text-[var(--navy)] opacity-80 font-medium mb-8 md:mb-12 uppercase tracking-widest text-[10px] md:text-xs">
              Access your Helima account
            </p>

            <button 
              onClick={handleSignIn}
              className="w-full bg-[var(--white)] text-[var(--navy)] py-3 md:py-4 font-black uppercase tracking-wider md:tracking-widest text-xs md:text-sm border-2 border-[var(--navy)] hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors flex items-center justify-center gap-2 md:gap-3 mb-6"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            <Link href="/" className="text-[var(--navy)] font-bold uppercase tracking-widest text-xs hover:text-[var(--gold)] transition-colors underline">
              Return to Store
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
