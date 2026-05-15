'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen bg-[var(--white)] py-20 selection:bg-[var(--navy)] selection:text-[var(--white)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="border-b-2 border-[var(--navy)] pb-8 mb-12">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Returns <br /> & Exchanges
            </h1>
            <p className="text-[var(--navy)] opacity-60 uppercase tracking-widest text-sm font-bold mt-4">
              Commitment to Quality
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-12">
          <ScrollReveal delay={200}>
            <section className="border-l-4 border-[var(--navy)] pl-6">
              <h2 className="text-2xl font-black text-[var(--navy)] uppercase tracking-tighter mb-4">14-Day Return Window</h2>
              <p className="text-[var(--navy)] opacity-80 leading-relaxed">
                We maintain uncompromising standards. If you are not satisfied with your acquisition, you may return it within 14 days of delivery. 
                Items must be in original condition, unused, and in their original packaging with all security tags intact.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <section className="border-l-4 border-[var(--navy)] pl-6">
              <h2 className="text-2xl font-black text-[var(--navy)] uppercase tracking-tighter mb-4">Non-Returnable Items</h2>
              <p className="text-[var(--navy)] opacity-80 leading-relaxed">
                Certain items, including customized goods, personal care items, and final sale acquisitions, are ineligible for return for hygiene and security reasons.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={600}>
            <section className="border-l-4 border-[var(--gold)] pl-6">
              <h2 className="text-2xl font-black text-[var(--navy)] uppercase tracking-tighter mb-4">Process a Return</h2>
              <p className="text-[var(--navy)] opacity-80 leading-relaxed mb-8">
                To initiate a return, please contact our support team via WhatsApp or use the link below to generate a return authorization.
              </p>
              <button className="bg-[var(--navy)] text-[var(--white)] px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-[var(--gold)] transition-colors">
                Initiate Return →
              </button>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
