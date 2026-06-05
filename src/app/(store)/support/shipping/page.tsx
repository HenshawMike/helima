import { Metadata } from 'next';
import ScrollReveal from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Helima",
  description: "Read about our domestic shipping timeframes, global logistics partner imports, dynamic custom duties calculation, and package tracking updates at Helima.",
  keywords: [
    "shipping policy",
    "delivery timeframe",
    "imported luxury shipping",
    "global logistics",
    "track package",
    "helima domestic shipping"
  ]
};

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-[var(--white)] py-12 md:py-20 selection:bg-[var(--navy)] selection:text-[var(--white)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="border-b-2 border-[var(--navy)] pb-6 md:pb-8 mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">
              Shipping <br /> Policy
            </h1>
            <p className="text-[var(--navy)] opacity-60 uppercase tracking-widest text-xs md:text-sm font-bold mt-3 md:mt-4">
              Global Logistics & Delivery
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-8 md:space-y-12">
          <ScrollReveal delay={200}>
            <section className="border-l-4 border-[var(--navy)] pl-6 text-left">
              <h2 className="text-xl md:text-2xl font-black text-[var(--navy)] uppercase tracking-tighter mb-3 md:mb-4">Domestic Shipping</h2>
              <p className="text-[var(--navy)] opacity-80 leading-relaxed text-sm md:text-base">
                All domestic orders are processed within 1-2 business days. Standard shipping typically takes 3-5 business days. 
                Premium expedited shipping is available at checkout for guaranteed 48-hour delivery.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <section className="border-l-4 border-[var(--navy)] pl-6 text-left">
              <h2 className="text-xl md:text-2xl font-black text-[var(--navy)] uppercase tracking-tighter mb-3 md:mb-4">International Imports</h2>
              <p className="text-[var(--navy)] opacity-80 leading-relaxed text-sm md:text-base">
                As a specialist in curated imports, some items may ship directly from our global partners. 
                International shipping typically takes 7-14 business days depending on customs clearance. 
                All duties and taxes are calculated at checkout for a seamless delivery experience.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={600}>
            <section className="border-l-4 border-[var(--gold)] pl-6 text-left">
              <h2 className="text-xl md:text-2xl font-black text-[var(--navy)] uppercase tracking-tighter mb-3 md:mb-4">Tracking & Updates</h2>
              <p className="text-[var(--navy)] opacity-80 leading-relaxed text-sm md:text-base">
                Once your order has shipped, you will receive an email with tracking information. 
                You can also track your order status directly through our website using your order ID.
              </p>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
