import Link from 'next/link';

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-end mb-8 border-b-4 border-[var(--navy)] pb-4">
        <h1 className="text-4xl font-black text-[var(--navy)] tracking-tighter uppercase">
          Products
        </h1>
        <Link href="/admin/products/new" className="bg-[var(--navy)] text-[var(--white)] px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-[var(--gold)] transition-colors">
          + Add Product
        </Link>
      </div>

      <div className="border-4 border-[var(--navy)] p-8 text-center">
        <p className="text-[var(--navy)] font-medium mb-6">Product management will connect to Firestore soon. Currently using fallback dummy data on storefront.</p>
      </div>
    </div>
  );
}
