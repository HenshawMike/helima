'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ProfilePage() {
  const { user, dbUser, loading, signOut, deleteAccount } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--white)]">
        <div className="w-12 h-12 border-4 border-[var(--navy)] border-t-[var(--gold)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: This will permanently delete your account and all associated data. This action cannot be undone. Proceed?')) {
      try {
        setIsDeleting(true);
        await deleteAccount();
        router.push('/');
      } catch (error: any) {
        if (error.code === 'auth/requires-recent-login') {
          alert('For security, please sign out and sign back in before deleting your account.');
        } else {
          alert('Error deleting account. Please try again.');
        }
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--white)] py-20 selection:bg-[var(--navy)] selection:text-[var(--white)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="border-b-2 border-[var(--navy)] pb-8 mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Account
              </h1>
              <p className="text-[var(--navy)] opacity-60 uppercase tracking-widest text-sm font-bold mt-4">
                Personal Workspace
              </p>
            </div>
            <button 
              onClick={handleSignOut}
              className="text-red-600 font-bold uppercase tracking-widest text-xs hover:text-[var(--gold)] transition-colors border-b border-current pb-1"
            >
              Logout
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* User Info Card */}
          <ScrollReveal delay={200} className="md:col-span-1">
            <div className="solid-card p-8">
              <div className="w-20 h-20 bg-[var(--navy)] text-[var(--white)] flex items-center justify-center text-3xl font-black mb-6">
                {user.displayName?.[0] || user.email?.[0] || 'U'}
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50 mb-1">Name</label>
                  <p className="text-lg font-black text-[var(--navy)] uppercase leading-tight">
                    {user.displayName || 'Anonymous User'}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50 mb-1">Email</label>
                  <p className="text-sm font-bold text-[var(--navy)] opacity-80">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50 mb-1">Member Since</label>
                  <p className="text-sm font-bold text-[var(--navy)] opacity-80">
                    {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Activity/Orders Placeholder */}
          <ScrollReveal delay={400} className="md:col-span-2">
            <div className="space-y-16">
              <div className="space-y-8">
                <div className="border-l-4 border-[var(--navy)] pl-6">
                  <h2 className="text-2xl font-black text-[var(--navy)] uppercase tracking-tighter mb-2">Order History</h2>
                  <p className="text-sm font-medium text-[var(--navy)] opacity-60 uppercase tracking-wide">Manage your recent acquisitions</p>
                </div>

                <div className="border-2 border-[var(--navy)] border-dashed p-12 text-center">
                  <div className="w-12 h-12 border-2 border-[var(--navy)] flex items-center justify-center mx-auto mb-6 opacity-30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-[var(--navy)] font-black uppercase tracking-widest text-xs opacity-40">No orders placed yet</p>
                  <button 
                    onClick={() => router.push('/products')}
                    className="mt-6 text-[var(--navy)] font-black uppercase tracking-widest text-xs hover:text-[var(--gold)] transition-colors"
                  >
                    Start Shopping →
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-8 pt-8 border-t border-[var(--navy)] opacity-50 hover:opacity-100 transition-opacity">
                <div className="border-l-4 border-red-600 pl-6">
                  <h2 className="text-xl font-black text-red-600 uppercase tracking-tighter mb-2">Danger Zone</h2>
                  <p className="text-xs font-medium text-[var(--navy)] opacity-60 uppercase tracking-wide">Irreversible account actions</p>
                </div>
                
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-red-600 text-white px-8 py-3 font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--navy)] transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete My Account'}
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
