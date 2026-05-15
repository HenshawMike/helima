'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, dbUser, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (dbUser && dbUser.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, dbUser, loading, router]);

  if (loading) {
    return <div className="min-h-screen bg-[var(--white)] flex justify-center items-center font-bold text-[var(--navy)]">Verifying Admin Access...</div>;
  }

  if (!user || (dbUser && dbUser.role !== 'admin')) {
    return null; // Will redirect
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
