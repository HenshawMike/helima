'use client';

import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory, Category } from '@/lib/firebase/firestore';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadCategories() {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setSubmitting(true);
    try {
      await createCategory(newCategoryName.trim());
      setNewCategoryName('');
      await loadCategories();
    } catch (error) {
      alert('Error creating category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (error) {
      alert('Error deleting category');
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Page Header */}
      <div className="mb-12 border-b-4 border-[var(--navy)] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-[var(--navy)] tracking-tighter uppercase">
            Categories Vault
          </h1>
          <p className="text-[var(--navy)] opacity-60 font-bold uppercase tracking-widest text-xs mt-1">
            Manage dynamic collections
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Create Category Box */}
        <div className="md:col-span-1 border-4 border-[var(--navy)] p-4 sm:p-6 bg-white self-start w-full">
          <h2 className="text-xl font-black text-[var(--navy)] tracking-tighter uppercase mb-6 border-b-2 border-[var(--navy)] pb-2">
            Add Category
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50">
                Category Name
              </label>
              <input 
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Luxury Goods"
                className="w-full border-2 border-[var(--navy)] p-3 font-bold uppercase tracking-widest text-xs outline-none focus:bg-[var(--navy)] focus:text-white transition-all rounded-none"
              />
            </div>
            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--navy)] text-white py-3 font-black uppercase tracking-widest text-xs hover:bg-[var(--gold)] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>

        {/* Categories List Box */}
        <div className="md:col-span-2 border-4 border-[var(--navy)] p-4 sm:p-6 bg-white">
          <h2 className="text-xl font-black text-[var(--navy)] tracking-tighter uppercase mb-6 border-b-2 border-[var(--navy)] pb-2">
            Active Categories
          </h2>

          {loading ? (
            <div className="text-[var(--navy)] font-bold animate-pulse text-sm uppercase tracking-widest py-8">
              Retrieving Categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-[var(--navy)] opacity-60 font-bold text-sm uppercase tracking-widest py-8">
              No categories found. Add one above!
            </div>
          ) : (
            <div className="divide-y-2 divide-[var(--navy)]">
              {categories.map((category) => (
                <div key={category.id} className="py-4 flex justify-between items-center group">
                  <div>
                    <h3 className="text-lg font-black text-[var(--navy)] uppercase tracking-tight">
                      {category.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--navy)] opacity-40">
                      slug: {category.slug}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="border-2 border-red-600 text-red-600 px-4 py-2 font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all rounded-none"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
