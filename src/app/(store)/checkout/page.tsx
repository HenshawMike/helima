'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useState, useEffect } from 'react';

function CheckoutItemImage({ imageUrl, name }: { imageUrl: string, name: string }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div className="w-16 h-16 border-2 border-[var(--navy)] flex-shrink-0 relative overflow-hidden bg-gray-100">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img 
        src={imageUrl} 
        alt={name}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover max-md:grayscale-0 md:grayscale transition-all duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { user, loading: authLoading, getIdToken, signInWithGoogle } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please complete the Google authentication to proceed.');
      } else {
        setError(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setSigningIn(false);
    }
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
  });

  // Pre-populate user details when user state is resolved
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || user.displayName?.split(' ')[0] || '',
        lastName: prev.lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const trimmedFirstName = formData.firstName.trim();
    const trimmedLastName = formData.lastName.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedAddress = formData.address.trim();
    const trimmedPhone = formData.phone.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedAddress || !trimmedPhone) {
      setError('Please fill in all shipping details first.');
      return;
    }

    if (!emailReg.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (trimmedPhone.length < 7 || trimmedPhone.length > 20) {
      setError('Please enter a valid phone number.');
      return;
    }

    setError('');
    setFormData({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      address: trimmedAddress,
      phone: trimmedPhone,
    });
    setStep(2);
  };

  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getIdToken();
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          amount: totalPrice,
          authToken: token,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
          metadata: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            shippingAddress: formData.address,
            phoneNumber: formData.phone,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.authorization_url) {
        throw new Error(data.error || 'Payment initialization failed. Please try again.');
      }

      // Redirect directly to Paystack's secure checkout page
      window.location.href = data.authorization_url;
    } catch (err: any) {
      console.error('Paystack error:', err);
      setError(err.message || 'An error occurred during payment initialization.');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--white)] flex flex-col justify-center items-center font-bold text-[var(--navy)] uppercase tracking-widest text-sm gap-4">
        <svg className="animate-spin h-8 w-8 text-[var(--navy)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Verifying Session...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[var(--white)] min-h-screen pt-32 pb-32 flex flex-col items-center justify-center">
        <div className="max-w-md w-full px-4 sm:px-6">
          <ScrollReveal>
            <div className="border-4 border-[var(--navy)] p-8 md:p-12 text-center bg-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[var(--gold)]"></div>
              <h2 className="text-2xl md:text-3xl font-black text-[var(--navy)] uppercase mb-4 md:mb-6">Authentication Required</h2>
              <p className="text-[var(--navy)] font-medium mb-6 md:mb-8 text-xs md:text-sm">Please sign in to your Helima account to complete your checkout securely.</p>
              {error && (
                <div className="mb-6 p-4 border-2 border-[var(--gold)] bg-white text-[var(--navy)] font-bold text-xs uppercase tracking-wider">
                  ⚠️ {error}
                </div>
              )}
              <button 
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="block w-full bg-[var(--navy)] text-white py-3 md:py-4 font-black uppercase tracking-widest text-xs md:text-sm border-2 border-[var(--navy)] hover:bg-white hover:text-[var(--navy)] transition-all text-center rounded-none disabled:opacity-50"
              >
                {signingIn ? 'Signing In...' : 'Sign In with Google'}
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--white)] min-h-screen pt-10 md:pt-16 pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
            <div className="w-8 md:w-12 h-1.5 md:h-2 bg-[var(--navy)]"></div>
            <h1 className="text-3xl md:text-7xl font-black text-[var(--navy)] tracking-tighter uppercase">
              Checkout
            </h1>
          </div>
        </ScrollReveal>

        {items.length === 0 ? (
          <ScrollReveal>
            <div className="border-4 border-[var(--navy)] p-8 md:p-16 text-center">
              <h2 className="text-2xl md:text-3xl font-black text-[var(--navy)] uppercase mb-4 md:mb-6">Your Cart is Empty</h2>
              <p className="text-[var(--navy)] font-medium mb-6 md:mb-8 text-sm md:text-base">Add some premium products to your cart before checking out.</p>
              <Link 
                href="/products" 
                className="inline-block bg-[var(--navy)] text-white px-6 py-3 md:px-8 md:py-4 font-black uppercase tracking-widest text-xs md:text-sm border-2 border-[var(--navy)] hover:bg-white hover:text-[var(--navy)] transition-colors"
              >
                Go to Shop
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
            <div className="lg:col-span-2">
              {error && (
                <div className="mb-6 p-4 border-2 border-[var(--gold)] bg-white text-[var(--navy)] font-bold text-xs uppercase tracking-wider">
                  ⚠️ {error}
                </div>
              )}

              {/* Step 1: Shipping */}
              <ScrollReveal delay={100}>
                <div className="mb-8 md:mb-12 border-4 border-[var(--navy)] p-5 md:p-8 bg-white">
                  <div className="flex items-center justify-between mb-8 border-b-2 border-[var(--navy)] pb-4">
                    <h2 className="text-lg md:text-2xl font-black text-[var(--navy)] uppercase tracking-widest">1. Contact & Shipping</h2>
                    <span className={`font-bold text-sm uppercase ${step > 1 ? 'text-green-600' : 'text-[var(--gold)]'}`}>
                      {step > 1 ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  
                  {step === 1 ? (
                    <form onSubmit={handleContinue} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[var(--navy)] font-bold uppercase tracking-widest text-xs mb-2">First Name</label>
                          <input 
                            type="text" 
                            required 
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full border-2 border-[var(--navy)] p-3 md:p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium rounded-none text-sm md:text-base" 
                          />
                        </div>
                        <div>
                          <label className="block text-[var(--navy)] font-bold uppercase tracking-widest text-xs mb-2">Last Name</label>
                          <input 
                            type="text" 
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full border-2 border-[var(--navy)] p-3 md:p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium rounded-none text-sm md:text-base" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[var(--navy)] font-bold uppercase tracking-widest text-xs mb-2">Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border-2 border-[var(--navy)] p-3 md:p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium rounded-none text-sm md:text-base" 
                          />
                        </div>
                        <div>
                          <label className="block text-[var(--navy)] font-bold uppercase tracking-widest text-xs mb-2">Phone Number</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="e.g. +2348012345678"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full border-2 border-[var(--navy)] p-3 md:p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium rounded-none text-sm md:text-base" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[var(--navy)] font-bold uppercase tracking-widest text-xs mb-2">Shipping Address</label>
                        <input 
                          type="text" 
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full border-2 border-[var(--navy)] p-3 md:p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium rounded-none text-sm md:text-base" 
                        />
                      </div>

                      <div className="pt-6">
                        <button 
                          type="submit" 
                          className="bg-[var(--navy)] text-white px-6 py-3 md:px-8 md:py-4 font-black uppercase tracking-widest text-xs md:text-sm border-2 border-[var(--navy)] hover:bg-white hover:text-[var(--navy)] transition-colors rounded-none"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2 font-medium text-[var(--navy)] text-sm">
                      <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Phone:</strong> {formData.phone}</p>
                      <p><strong>Address:</strong> {formData.address}</p>
                      <button 
                        onClick={() => setStep(1)} 
                        className="text-[var(--gold)] font-bold uppercase text-xs tracking-wider underline mt-4 block"
                      >
                        Edit Shipping Info
                      </button>
                    </div>
                  )}
                </div>
              </ScrollReveal>

              {/* Step 2: Payment */}
              <ScrollReveal delay={200}>
                <div className={`border-4 border-[var(--navy)] p-5 md:p-8 bg-white ${step < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between mb-8 border-b-2 border-[var(--navy)] pb-4">
                    <h2 className="text-lg md:text-2xl font-black text-[var(--navy)] uppercase tracking-widest">2. Payment</h2>
                    <span className="text-[var(--navy)] font-bold text-sm uppercase">Secure</span>
                  </div>
                  
                  {step >= 2 && (
                    <div className="space-y-6">
                      <p className="text-[var(--navy)] font-medium mb-6">
                        Your payment will be processed securely in Nigerian Naira (₦) through Paystack.
                      </p>
                      
                      <button 
                        onClick={handlePay}
                        disabled={loading}
                        className="w-full bg-[var(--gold)] text-white py-3.5 md:py-5 font-black uppercase tracking-widest text-xs md:text-sm border-2 border-[var(--gold)] hover:bg-[var(--navy)] hover:border-[var(--navy)] transition-colors flex items-center justify-center gap-2 rounded-none disabled:opacity-50 disabled:cursor-wait"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Initializing Secure Gateway...
                          </>
                        ) : (
                          `Pay ₦${totalPrice.toFixed(2)} with Paystack`
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
            
            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <ScrollReveal delay={300} direction="right">
                <div className="border-4 border-[var(--navy)] p-5 md:p-8 sticky top-24 bg-white">
                  <h3 className="text-xl md:text-2xl font-black text-[var(--navy)] uppercase mb-6 md:mb-8 border-b-2 border-[var(--navy)] pb-3 md:pb-4 tracking-widest">Order</h3>
                  
                  <div className="space-y-6 mb-8 max-h-64 overflow-y-auto pr-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <CheckoutItemImage imageUrl={item.imageUrl} name={item.name} />
                        <div>
                          <h4 className="font-bold text-[var(--navy)] uppercase text-sm leading-tight">{item.name}</h4>
                          <div className="text-[var(--navy)] text-xs font-bold mt-1">QTY: {item.quantity} × ₦{item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t-2 border-[var(--navy)] pt-6 mb-8 flex justify-between items-end">
                    <span className="uppercase text-sm tracking-widest font-bold text-[var(--navy)]">Total</span>
                    <span className="text-2xl md:text-3xl font-black text-[var(--navy)]">₦{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
