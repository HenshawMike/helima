import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--navy)] text-[var(--white)] border-t-2 border-[var(--navy)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-bold text-2xl tracking-tighter text-[var(--white)] flex items-center gap-2 mb-6 uppercase">
              <span className="w-8 h-8 bg-[var(--white)] text-[var(--navy)] flex items-center justify-center font-black">H</span>
              ELIMA
            </Link>
            <p className="text-[var(--white)] opacity-80 max-w-sm leading-relaxed mb-6">
              Premium imported products. Simple checkout. WhatsApp support.
            </p>
          </div>
          
          <div>
            <h3 className="text-[var(--white)] font-bold text-lg mb-6 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-2 h-2 bg-[var(--red)]"></span>
              Shop
            </h3>
            <ul className="space-y-4">
              <li><Link href="/products" className="opacity-80 hover:opacity-100 hover:text-[var(--red)] transition-colors inline-block uppercase text-sm">All Products</Link></li>
              <li><Link href="/categories/electronics" className="opacity-80 hover:opacity-100 hover:text-[var(--red)] transition-colors inline-block uppercase text-sm">Electronics</Link></li>
              <li><Link href="/categories/fashion" className="opacity-80 hover:opacity-100 hover:text-[var(--red)] transition-colors inline-block uppercase text-sm">Fashion</Link></li>
              <li><Link href="/categories/home" className="opacity-80 hover:opacity-100 hover:text-[var(--red)] transition-colors inline-block uppercase text-sm">Home & Garden</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-[var(--white)] font-bold text-lg mb-6 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-2 h-2 bg-[var(--red)]"></span>
              Support
            </h3>
            <ul className="space-y-4">
              <li><a href="#" className="opacity-80 hover:opacity-100 hover:text-[var(--red)] transition-colors inline-block uppercase text-sm">WhatsApp Support</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 hover:text-[var(--red)] transition-colors inline-block uppercase text-sm">Track Order</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 hover:text-[var(--red)] transition-colors inline-block uppercase text-sm">Shipping Policy</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 hover:text-[var(--red)] transition-colors inline-block uppercase text-sm">Returns</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[var(--white)] border-opacity-20 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-60 uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Helima.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm opacity-60 hover:opacity-100 hover:text-[var(--red)] transition-colors uppercase tracking-wider">Terms</a>
            <a href="#" className="text-sm opacity-60 hover:opacity-100 hover:text-[var(--red)] transition-colors uppercase tracking-wider">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
