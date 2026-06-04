'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminProducts, updateProduct, deleteProduct } from '@/lib/firebase/firestore';


export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const data = await getAdminProducts();
    setProducts(data);
    setLoading(false);
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateProduct(id, { isActive: !currentStatus } as any);
      fetchProducts();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12 border-b-4 border-[var(--navy)] pb-6">
        <h1 className="text-4xl font-black text-[var(--navy)] tracking-tighter uppercase">
          Inventory
        </h1>
        <Link href="/h-vault/products/new" className="bg-[var(--navy)] text-[var(--white)] px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-[var(--gold)] transition-colors text-center w-full sm:w-auto">
          + Add Product
        </Link>
      </div>

      {loading ? (
        <div className="text-[var(--navy)] font-bold animate-pulse">Loading Inventory...</div>
      ) : products.length === 0 ? (
        <div className="border-4 border-[var(--navy)] border-dashed p-12 text-center">
          <p className="text-[var(--navy)] font-black uppercase tracking-widest text-xs opacity-40 mb-6">Warehouse is empty</p>
          <Link href="/h-vault/products/new" className="text-[var(--navy)] font-black uppercase tracking-widest text-xs border-b-2 border-[var(--navy)] pb-1 hover:text-[var(--gold)]">
            Create First Product →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border-4 border-[var(--navy)] p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-[var(--navy)] transition-all">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-16 h-16 bg-[var(--white)] border-2 border-[var(--navy)] flex-shrink-0 overflow-hidden">
                  <img src={product.imageUrl} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--navy)] group-hover:text-[var(--white)] mb-1 opacity-50">
                    {product.category}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[var(--navy)] group-hover:text-[var(--white)] uppercase leading-none mb-2">
                    {product.name}
                  </h3>
                  <div className="text-[var(--navy)] group-hover:text-[var(--white)] font-bold text-sm">
                    ₦{product.price.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full md:w-auto">
                <button 
                  onClick={() => handleToggleStatus(product.id, (product as any).isActive ?? true)}
                  className={`flex-1 md:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-colors ${
                    (product as any).isActive !== false 
                      ? 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white' 
                      : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                  } group-hover:border-white group-hover:text-white`}
                >
                  {(product as any).isActive !== false ? 'Active' : 'Hidden'}
                </button>
                <Link 
                  href={`/h-vault/products/${product.id}`}
                  className="flex-1 md:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white group-hover:border-white group-hover:text-white transition-colors text-center"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 md:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white group-hover:border-red-400 group-hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
