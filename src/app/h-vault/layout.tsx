'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, dbUser, loading, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // If the user logs in successfully but is NOT an admin, show error and sign out immediately
    if (user && dbUser && dbUser.role !== 'admin') {
      setError('Access Denied: You do not have administrator privileges.');
      signOut();
    }
  }, [user, dbUser, signOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'An error occurred during sign-in.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--white)] flex flex-col justify-center items-center font-bold text-[var(--navy)] uppercase tracking-widest text-sm gap-4">
        <svg className="animate-spin h-8 w-8 text-[var(--navy)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Verifying Admin Access...
      </div>
    );
  }

  // If user is not authenticated or not an admin, render the login screen
  if (!user || !dbUser || dbUser.role !== 'admin') {
    return (
      <div className="bg-[var(--white)] min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="border-4 border-[var(--navy)] p-12 bg-white text-center shadow-lg relative overflow-hidden">
            {/* Top gold accent line */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[var(--gold)]"></div>
            
            <h1 className="text-4xl font-black text-[var(--navy)] tracking-tighter uppercase mb-2">
              H-Vault <span className="text-[var(--gold)]">Admin</span>
            </h1>
            <p className="text-[var(--navy)] opacity-80 font-bold mb-10 uppercase tracking-widest text-xs">
              Secure Administration Access
            </p>

            {error && (
              <div className="mb-6 p-4 border-2 border-[var(--gold)] bg-[var(--white)] text-[var(--navy)] text-xs font-bold uppercase tracking-wider text-left rounded-none flex items-start gap-2">
                <svg className="w-4 h-4 text-[var(--gold)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <label className="block text-[var(--navy)] font-black uppercase tracking-widest text-xs mb-2">
                  Email Address
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@helima.com"
                  className="w-full border-2 border-[var(--navy)] px-4 py-3 text-[var(--navy)] font-bold text-sm bg-[var(--white)] focus:outline-none focus:border-[var(--gold)] transition-colors rounded-none placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[var(--navy)] font-black uppercase tracking-widest text-xs mb-2">
                  Password
                </label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-2 border-[var(--navy)] px-4 py-3 text-[var(--navy)] font-bold text-sm bg-[var(--white)] focus:outline-none focus:border-[var(--gold)] transition-colors rounded-none placeholder-gray-400"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-[var(--navy)] text-[var(--white)] py-4 font-black uppercase tracking-widest text-sm border-2 border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)] transition-all flex items-center justify-center gap-2 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Authorize Access'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link 
                href="/" 
                className="text-[var(--navy)] opacity-60 hover:opacity-100 font-bold uppercase tracking-widest text-xs hover:text-[var(--gold)] transition-colors underline"
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--white)]">
      {/* Sidebar */}
      <aside className="w-64 border-r-4 border-[var(--navy)] flex flex-col">
        <div className="p-6 border-b-4 border-[var(--navy)]">
          <Link href="/" className="text-2xl font-black text-[var(--navy)] uppercase tracking-tighter">
            Helima <span className="text-[var(--gold)]">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/h-vault" className="block px-4 py-3 text-[var(--navy)] font-bold uppercase tracking-widest text-sm hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors">
            Dashboard
          </Link>
          <Link href="/h-vault/products" className="block px-4 py-3 text-[var(--navy)] font-bold uppercase tracking-widest text-sm hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors">
            Products
          </Link>
          <Link href="/h-vault/categories" className="block px-4 py-3 text-[var(--navy)] font-bold uppercase tracking-widest text-sm hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors">
            Categories
          </Link>
          <Link href="/h-vault/orders" className="block px-4 py-3 text-[var(--navy)] font-bold uppercase tracking-widest text-sm hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors">
            Orders
          </Link>
        </nav>
        <div className="p-4 border-t-4 border-[var(--navy)]">
          <div className="text-[var(--navy)] font-bold uppercase text-xs mb-4 break-all">
            {user.email}
          </div>
          <button 
            onClick={signOut}
            className="w-full border-2 border-[var(--navy)] text-[var(--navy)] font-bold uppercase tracking-widest text-xs py-2 hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[var(--white)]">
        <div className="p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
