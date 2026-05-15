import ProductCard from '@/components/store/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { PRODUCTS } from '@/lib/dummy-data';

export default function ProductsPage() {
  return (
    <div className="bg-[var(--white)] min-h-screen">
      {/* Header Section */}
      <section className="bg-[var(--white)] border-b-2 border-[var(--navy)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="text-5xl md:text-7xl font-black text-[var(--navy)] tracking-tighter uppercase mb-6">
              All Products
            </h1>
            <div className="flex gap-4 border-t-2 border-[var(--navy)] pt-6">
              <span className="text-[var(--navy)] font-bold uppercase tracking-widest text-sm border-2 border-[var(--navy)] px-4 py-2 bg-[var(--navy)] text-[var(--white)]">All</span>
              <button className="text-[var(--navy)] font-bold uppercase tracking-widest text-sm border-2 border-[var(--navy)] px-4 py-2 hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors">Electronics</button>
              <button className="text-[var(--navy)] font-bold uppercase tracking-widest text-sm border-2 border-[var(--navy)] px-4 py-2 hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors">Fashion</button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map((product, index) => (
              <ScrollReveal key={product.id} delay={(index % 4) * 100}>
                <ProductCard {...product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
