'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useState } from 'react';

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
  });

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.phone) {
      setError('Please fill in all shipping details first.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          amount: totalPrice,
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

  return (
    <div className="bg-[var(--white)] min-h-screen pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-2 bg-[var(--navy)]"></div>
            <h1 className="text-5xl md:text-7xl font-black text-[var(--navy)] tracking-tighter uppercase">
              Checkout
            </h1>
          </div>
        </ScrollReveal>

        {items.length === 0 ? (
          <ScrollReveal>
            <div className="border-4 border-[var(--navy)] p-16 text-center">
              <h2 className="text-3xl font-black text-[var(--navy)] uppercase mb-6">Your Cart is Empty</h2>
              <p className="text-[var(--navy)] font-medium mb-8">Add some premium products to your cart before checking out.</p>
              <Link 
                href="/products" 
                className="inline-block bg-[var(--navy)] text-white px-8 py-4 font-black uppercase tracking-widest text-sm border-2 border-[var(--navy)] hover:bg-white hover:text-[var(--navy)] transition-colors"
              >
                Go to Shop
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              {error && (
                <div className="mb-6 p-4 border-2 border-[var(--gold)] bg-white text-[var(--navy)] font-bold text-xs uppercase tracking-wider">
                  ⚠️ {error}
                </div>
              )}

              {/* Step 1: Shipping */}
              <ScrollReveal delay={100}>
                <div className="mb-12 border-4 border-[var(--navy)] p-8 bg-white">
                  <div className="flex items-center justify-between mb-8 border-b-2 border-[var(--navy)] pb-4">
                    <h2 className="text-2xl font-black text-[var(--navy)] uppercase tracking-widest">1. Contact & Shipping</h2>
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
                            className="w-full border-2 border-[var(--navy)] p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium rounded-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-[var(--navy)] font-bold uppercase tracking-widest text-xs mb-2">Last Name</label>
                          <input 
                            type="text" 
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full border-2 border-[var(--navy)] p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium rounded-none" 
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
                            className="w-full border-2 border-[var(--navy)] p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium rounded-none" 
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
                            className="w-full border-2 border-[var(--navy)] p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium rounded-none" 
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
                          className="w-full border-2 border-[var(--navy)] p-4 bg-transparent outline-none focus:border-[var(--gold)] text-[var(--navy)] font-medium rounded-none" 
                        />
                      </div>

                      <div className="pt-6">
                        <button 
                          type="submit" 
                          className="bg-[var(--navy)] text-white px-8 py-4 font-black uppercase tracking-widest text-sm border-2 border-[var(--navy)] hover:bg-white hover:text-[var(--navy)] transition-colors rounded-none"
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
                <div className={`border-4 border-[var(--navy)] p-8 bg-white ${step < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between mb-8 border-b-2 border-[var(--navy)] pb-4">
                    <h2 className="text-2xl font-black text-[var(--navy)] uppercase tracking-widest">2. Payment</h2>
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
                        className="w-full bg-[var(--gold)] text-white py-5 font-black uppercase tracking-widest text-sm border-2 border-[var(--gold)] hover:bg-[var(--navy)] hover:border-[var(--navy)] transition-colors flex items-center justify-center gap-2 rounded-none disabled:opacity-50 disabled:cursor-wait"
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
                <div className="border-4 border-[var(--navy)] p-8 sticky top-24 bg-white">
                  <h3 className="text-2xl font-black text-[var(--navy)] uppercase mb-8 border-b-2 border-[var(--navy)] pb-4 tracking-widest">Order</h3>
                  
                  <div className="space-y-6 mb-8 max-h-64 overflow-y-auto pr-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 border-2 border-[var(--navy)] flex-shrink-0 bg-cover bg-center grayscale" style={{ backgroundImage: `url('${item.imageUrl}')` }}></div>
                        <div>
                          <h4 className="font-bold text-[var(--navy)] uppercase text-sm leading-tight">{item.name}</h4>
                          <div className="text-[var(--navy)] text-xs font-bold mt-1">QTY: {item.quantity} × ₦{item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t-2 border-[var(--navy)] pt-6 mb-8 flex justify-between items-end">
                    <span className="uppercase text-sm tracking-widest font-bold text-[var(--navy)]">Total</span>
                    <span className="text-3xl font-black text-[var(--navy)]">₦{totalPrice.toFixed(2)}</span>
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
