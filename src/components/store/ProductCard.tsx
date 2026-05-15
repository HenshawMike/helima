import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export default function ProductCard({ id, name, price, imageUrl, category }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      price,
      imageUrl,
      quantity: 1
    });
  };

  return (
    <div className="solid-card group flex flex-col h-full relative bg-[var(--white)]">
      <div className="relative aspect-square w-full overflow-hidden border-b border-[var(--navy)]">
        {/* Placeholder for actual next/image */}
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        
        {/* Minimal Quick add button overlay */}
        <div className="absolute inset-0 bg-navy/10 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-[var(--navy)] text-[var(--white)] py-3 px-4 font-bold uppercase tracking-widest text-sm border-2 border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)] transition-colors"
          >
            Quick Add
          </button>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold">
            {category}
          </div>
          <div className="w-1.5 h-1.5 bg-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        <Link href={`/products/${id}`} className="block flex-grow">
          <h3 className="text-lg font-black text-[var(--navy)] uppercase leading-tight">
            {name}
          </h3>
        </Link>
        <div className="mt-6 flex items-center justify-between border-t border-[var(--navy)] pt-4">
          <span className="text-xl font-black text-[var(--navy)]">
            ${price.toFixed(2)}
          </span>
          <button 
            onClick={handleAddToCart}
            className="w-10 h-10 border-2 border-[var(--navy)] flex items-center justify-center text-[var(--navy)] hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
