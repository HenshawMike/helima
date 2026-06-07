import { Metadata } from 'next';
import ScrollReveal from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: "Returns & Exchanges Policy ",
  description: "Learn about our uncompromising standards, our 14-day return window, and how to process a return for your premium acquisitions at Helima.",
  keywords: [
    "returns policy",
    "exchanges policy",
    "14-day returns",
    "premium goods refund",
    "process a return",
    "helima customer satisfaction"
  ]
};

export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen bg-[var(--white)] py-12 md:py-20 selection:bg-[var(--navy)] selection:text-[var(--white)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="border-b-2 border-[var(--navy)] pb-6 md:pb-8 mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">
              Returns <br /> & Exchanges
            </h1>
            <p className="text-[var(--navy)] opacity-60 uppercase tracking-widest text-xs md:text-sm font-bold mt-3 md:mt-4">
              Commitment to Quality
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-8 md:space-y-12">
          <ScrollReveal delay={200}>
            <section className="border-l-4 border-[var(--navy)] pl-6 text-left">
              <h2 className="text-xl md:text-2xl font-black text-[var(--navy)] uppercase tracking-tighter mb-3 md:mb-4">14-Day Return Window</h2>
              <p className="text-[var(--navy)] opacity-80 leading-relaxed text-sm md:text-base">
                We maintain uncompromising standards. If you are not satisfied with your acquisition, you may return it within 14 days of delivery. 
                Items must be in original condition, unused, and in their original packaging with all security tags intact.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <section className="border-l-4 border-[var(--navy)] pl-6 text-left">
              <h2 className="text-xl md:text-2xl font-black text-[var(--navy)] uppercase tracking-tighter mb-3 md:mb-4">Non-Returnable Items</h2>
              <p className="text-[var(--navy)] opacity-80 leading-relaxed text-sm md:text-base">
                Certain items, including customized goods, personal care items, and final sale acquisitions, are ineligible for return for hygiene and security reasons.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={600}>
            <section className="border-l-4 border-[var(--gold)] pl-6 text-left">
              <h2 className="text-xl md:text-2xl font-black text-[var(--navy)] uppercase tracking-tighter mb-3 md:mb-4">Process a Return</h2>
              <p className="text-[var(--navy)] opacity-80 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
                To initiate a return, please contact our support team via WhatsApp or use the link below to generate a return authorization.
              </p>
              <button className="bg-[var(--navy)] text-[var(--white)] px-6 py-3 md:px-8 md:py-4 font-black uppercase tracking-widest text-xs hover:bg-[var(--gold)] transition-colors cursor-pointer">
                Initiate Return →
              </button>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
