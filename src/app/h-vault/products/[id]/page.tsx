'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProductById, updateProduct, getCategories, Category } from '@/lib/firebase/firestore';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    async function loadProduct() {
      if (typeof id !== 'string') return;
      const product = await getProductById(id);
      if (product) {
        setFormData({
          name: product.name,
          price: product.price.toString(),
          category: product.category,
          imageUrl: product.imageUrl,
          description: product.description,
          isActive: (product as any).isActive !== false,
        });
      }
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (typeof id !== 'string') return;
      await updateProduct(id, {
        ...formData,
        price: parseFloat(formData.price),
      });
      router.push('/h-vault/products');
    } catch (error) {
      alert('Error updating product');
      setSaving(false);
    }
  };

  if (loading) return <div className="text-[var(--navy)] font-bold animate-pulse text-2xl uppercase tracking-tighter">Locating Product...</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-12 border-b-4 border-[var(--navy)] pb-6">
        <h1 className="text-4xl font-black text-[var(--navy)] tracking-tighter uppercase">
          Modify Item
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
            <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50">Price (NGN ₦)</label>
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
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="text-[9px] uppercase tracking-wider text-[var(--navy)] opacity-40 font-bold">
              * Manage categories in the sidebar Vault
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50">Image URL</label>
            <input 
              type="url" 
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full border-2 border-[var(--navy)] p-3 font-bold uppercase tracking-widest text-xs outline-none focus:bg-[var(--navy)] focus:text-white transition-all"
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
            disabled={saving}
            className="bg-[var(--navy)] text-white px-12 py-4 font-black uppercase tracking-widest text-sm hover:bg-[var(--gold)] transition-colors disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Product'}
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
