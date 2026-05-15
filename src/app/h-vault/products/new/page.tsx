'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/lib/firebase/firestore';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
    description: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProduct({
        ...formData,
        price: parseFloat(formData.price),
      });
      router.push('/h-vault/products');
    } catch (error) {
      alert('Error creating product');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-12 border-b-4 border-[var(--navy)] pb-6">
        <h1 className="text-4xl font-black text-[var(--navy)] tracking-tighter uppercase">
          New Acquisition
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50">Product Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border-2 border-[var(--navy)] p-3 font-bold uppercase tracking-widest text-xs outline-none focus:bg-[var(--navy)] focus:text-white transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50">Price (USD)</label>
            <input 
              type="number" 
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border-2 border-[var(--navy)] p-3 font-bold uppercase tracking-widest text-xs outline-none focus:bg-[var(--navy)] focus:text-white transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50">Category</label>
            <select 
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border-2 border-[var(--navy)] p-3 font-bold uppercase tracking-widest text-xs outline-none focus:bg-[var(--navy)] focus:text-white transition-all appearance-none"
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home & Garden</option>
              <option value="Furniture">Furniture</option>
              <option value="Kitchen">Kitchen</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50">Image URL</label>
            <input 
              type="url" 
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full border-2 border-[var(--navy)] p-3 font-bold uppercase tracking-widest text-xs outline-none focus:bg-[var(--navy)] focus:text-white transition-all"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50">Description</label>
          <textarea 
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border-2 border-[var(--navy)] p-3 font-bold uppercase tracking-widest text-xs outline-none focus:bg-[var(--navy)] focus:text-white transition-all resize-none"
          ></textarea>
        </div>

        <div className="flex items-center gap-4">
          <button 
            type="submit"
            disabled={loading}
            className="bg-[var(--navy)] text-white px-12 py-4 font-black uppercase tracking-widest text-sm hover:bg-[var(--gold)] transition-colors disabled:opacity-50"
          >
            {loading ? 'Committing...' : 'Save Product'}
          </button>
          <button 
            type="button"
            onClick={() => router.back()}
            className="text-[var(--navy)] font-bold uppercase tracking-widest text-xs border-b-2 border-[var(--navy)] pb-1 hover:text-red-600 hover:border-red-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
