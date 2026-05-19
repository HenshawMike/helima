'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ui/ScrollReveal';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const reference = searchParams.get('reference');
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed' | 'direct'>('verifying');
  const [errorMsg, setErrorMsg] = useState('');
  const [verified, setVerified] = useState(false);
  const hasCalled = useRef(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '1234567890';
  const message = encodeURIComponent(`Hello Helima! I just completed my order online (Paystack Ref: ${reference || 'N/A'}). I would like to coordinate shipping.`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  useEffect(() => {
    if (!reference) {
      // Direct visit without checkout redirect
      setStatus('direct');
      return;
    }

    if (verified || hasCalled.current) {
      return;
    }

    // Set guards immediately before making the async network call
    hasCalled.current = true;
    setVerified(true);

    async function verifyPayment() {
      try {
        console.log('Initializing Paystack transaction verification for reference:', reference);
        const response = await fetch(`/api/paystack/verify?reference=${reference}`);
        const data = await response.json();
        console.log('VERIFY RESPONSE:', data);

        if (response.ok && data.status === 'success') {
          // Clear local shopping cart immediately on successful verification!
          clearCart();
          setStatus('success');
        } else {
          setErrorMsg(data.error || 'Payment verification failed.');
          setStatus('failed');
          // Allow retrying if the network or verification failed temporarily
          hasCalled.current = false;
          setVerified(false);
        }
      } catch (err) {
        console.error('Verification error:', err);
        setErrorMsg('Network error. Unable to verify payment.');
        setStatus('failed');
        hasCalled.current = false;
        setVerified(false);
      }
    }

    verifyPayment();
  }, [reference, clearCart, verified]);

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="animate-spin h-16 w-16 text-[var(--navy)] mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 className="text-2xl font-black uppercase text-[var(--navy)] tracking-wider animate-pulse">
          Securing Payment Verification...
        </h2>
        <p className="text-xs uppercase tracking-widest text-[var(--navy)] opacity-60 font-bold mt-2">
          Please do not refresh or close this window
        </p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="border-4 border-red-600 p-12 bg-white text-center max-w-xl mx-auto">
        <div className="w-16 h-16 border-4 border-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-600 text-3xl font-black">!</span>
        </div>
        <h2 className="text-3xl font-black text-red-600 uppercase tracking-tighter mb-4">Verification Failed</h2>
        <p className="text-[var(--navy)] font-medium mb-8">
          {errorMsg || 'We were unable to verify your payment transaction. If you were debited, please contact us immediately.'}
        </p>
        <div className="flex flex-col gap-4">
          <Link 
            href="/cart"
            className="w-full bg-[var(--navy)] text-white py-4 font-black uppercase tracking-widest text-sm border-2 border-[var(--navy)] hover:bg-white hover:text-[var(--navy)] transition-all"
          >
            Return to Cart
          </Link>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white py-4 font-black uppercase tracking-widest text-sm border-2 border-[#25D366] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Message Support on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <ScrollReveal>
        <div className="w-24 h-24 border-4 border-[var(--navy)] rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-[var(--navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <h1 className="text-5xl md:text-7xl font-black text-[var(--navy)] tracking-tighter uppercase mb-6">
          Order Confirmed
        </h1>
        <p className="text-[var(--navy)] text-lg font-medium mb-12">
          Your payment in Naira (₦) was successfully processed. We are preparing your premium goods for delivery.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <div className="border-4 border-[var(--navy)] p-8 bg-[var(--navy)] text-[var(--white)] mb-12">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Next Steps</h2>
          <p className="mb-8 font-medium">
            Please message us on WhatsApp to finalize shipping and receive live logistics updates.
          </p>
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-5 font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity border-2 border-[#25D366]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Message Helima on WhatsApp
          </a>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <Link href="/" className="text-[var(--navy)] font-bold uppercase tracking-widest text-sm hover:text-[var(--gold)] transition-colors underline">
          Return to Homepage
        </Link>
      </ScrollReveal>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="bg-[var(--white)] min-h-screen pt-24 pb-32 flex flex-col items-center justify-center text-center">
      <Suspense fallback={
        <div className="text-[var(--navy)] font-bold uppercase tracking-widest text-sm animate-pulse">
          Loading success channels...
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
