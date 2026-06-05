'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/admin-fetch';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
    description: '',
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert('Cloudinary is not configured. Please define NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment variables.');
      setUploading(false);
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append('file', file);
    formDataPayload.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formDataPayload,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await res.json();
      setFormData(prev => ({ ...prev, imageUrl: data.secure_url }));
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      setUploadError(err.message || 'Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    adminFetch('/api/admin/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(err => console.error('Error loading categories:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });
      if (res.ok) {
        router.push('/h-vault/products');
      } else {
        alert('Error creating product');
        setLoading(false);
      }
    } catch (error) {
      alert('Error creating product');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8 sm:mb-12 border-b-4 border-[var(--navy)] pb-6">
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
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="url" 
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full sm:flex-1 border-2 border-[var(--navy)] p-3 font-bold uppercase tracking-widest text-xs outline-none focus:bg-[var(--navy)] focus:text-white transition-all"
                placeholder="https://images.unsplash.com/..."
              />
              <label className="w-full sm:w-auto bg-[var(--navy)] text-white px-4 py-3 font-bold uppercase tracking-widest text-[10px] border-2 border-[var(--navy)] hover:bg-white hover:text-[var(--navy)] transition-colors cursor-pointer flex items-center justify-center shrink-0">
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            {uploadError && (
              <div className="text-[10px] text-red-600 font-bold uppercase tracking-wider">{uploadError}</div>
            )}
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button 
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-[var(--navy)] text-white px-12 py-4 font-black uppercase tracking-widest text-sm hover:bg-[var(--gold)] transition-colors disabled:opacity-50 text-center"
          >
            {loading ? 'Committing...' : 'Save Product'}
          </button>
          <button 
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto text-center py-2 text-[var(--navy)] font-bold uppercase tracking-widest text-xs border-b-2 border-[var(--navy)] sm:border-b-0 hover:text-red-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
