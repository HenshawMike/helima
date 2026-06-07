import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  availability?: 'available' | 'preorder';
}

export default function ProductCard({ id, name, price, imageUrl, category, availability }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const cartItem = items.find((item) => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    if (!isAdded) return;
    const timer = setTimeout(() => {
      setIsAdded(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isAdded]);

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
    setIsAdded(true);
  };

  const [imageLoaded, setImageLoaded] = useState(false);

  const isPreorder = availability === 'preorder';

  return (
    <div className="solid-card group flex flex-col h-full relative bg-[var(--white)]">
      <div className="relative aspect-square w-full overflow-hidden border-b border-[var(--navy)] bg-gray-100">
        {/* Skeletal loading indicator */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        <img 
          src={imageUrl} 
          alt={name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover max-md:grayscale-0 md:grayscale group-hover:grayscale-0 transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Pre-order Badge */}
        {isPreorder && (
          <div className="absolute top-3 left-3 bg-[var(--gold)] text-[var(--navy)] font-black text-[9px] uppercase tracking-widest px-2.5 py-1 z-10 border border-[var(--navy)] shadow-[2px_2px_0_0_var(--navy)]">
            Pre-Order
          </div>
        )}
        
        {/* Minimal Quick add button overlay */}
        <div className="absolute inset-0 bg-navy/10 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddToCart}
            className={`w-full py-2.5 md:py-3 px-3 md:px-4 font-bold uppercase tracking-widest text-xs md:text-sm border-2 transition-colors ${
              isAdded 
                ? 'bg-[var(--gold)] text-[var(--white)] border-[var(--gold)]' 
                : 'bg-[var(--navy)] text-[var(--white)] border-[var(--navy)] hover:bg-[var(--white)] hover:text-[var(--navy)]'
            }`}
          >
            {isAdded ? 'Added' : (isPreorder ? 'Pre-Order' : 'Quick Add')}
          </button>
        </div>
      </div>
      
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold">
            {category}
          </div>
          <div className="w-1.5 h-1.5 bg-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        <Link href={`/products/${id}`} className="block flex-grow">
          <h3 className="text-base md:text-lg font-black text-[var(--navy)] uppercase leading-tight">
            {name}
          </h3>
        </Link>
        <div className="mt-4 md:mt-6 flex items-center justify-between border-t border-[var(--navy)] pt-3 md:pt-4">
          <span className="text-lg md:text-xl font-black text-[var(--navy)]">
            ₦{price.toFixed(2)}
          </span>
          {quantity > 0 ? (
            <div className="flex items-center border-2 border-[var(--navy)] h-8 md:h-10 bg-[var(--white)] overflow-hidden">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(id, quantity - 1);
                }}
                className="w-7 md:w-8 h-full flex items-center justify-center text-[var(--navy)] hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors"
                title="Reduce count"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-7 md:w-8 text-center text-xs md:text-sm font-black text-[var(--navy)] select-none">
                {quantity}
              </span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(id, quantity + 1);
                  setIsAdded(true);
                }}
                className="w-7 md:w-8 h-full flex items-center justify-center text-[var(--navy)] hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors"
                title="Increase count"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="w-8 h-8 md:w-10 md:h-10 border-2 border-[var(--navy)] flex items-center justify-center text-[var(--navy)] hover:bg-[var(--navy)] hover:text-[var(--white)] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="solid-card flex flex-col h-full relative bg-[var(--white)] animate-pulse border-2 border-[var(--navy)]">
      <div className="relative aspect-square w-full bg-gray-200 border-b-2 border-[var(--navy)]" />
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        <div className="h-3 w-16 bg-gray-200 mb-2 rounded" />
        <div className="h-5 w-4/5 bg-gray-200 mb-1 rounded" />
        <div className="h-5 w-2/3 bg-gray-200 mb-4 rounded" />
        <div className="mt-auto pt-3 border-t border-[var(--navy)] flex justify-between items-center">
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-8 w-8 md:h-10 md:w-10 bg-gray-200 border-2 border-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
