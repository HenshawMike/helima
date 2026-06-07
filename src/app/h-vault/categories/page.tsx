'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: string[];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [pendingSubcategories, setPendingSubcategories] = useState<string[]>([]);
  const [pendingSubInput, setPendingSubInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [savingSubcategories, setSavingSubcategories] = useState<string | null>(null);

  async function loadCategories() {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddPendingSub = () => {
    const trimmed = pendingSubInput.trim();
    if (!trimmed) return;
    if (pendingSubcategories.some(s => s.toLowerCase() === trimmed.toLowerCase())) return;
    setPendingSubcategories(prev => [...prev, trimmed]);
    setPendingSubInput('');
  };

  const handleRemovePendingSub = (sub: string) => {
    setPendingSubcategories(prev => prev.filter(s => s !== sub));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setSubmitting(true);
    try {
      await adminFetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ 
          name: newCategoryName.trim(),
          subcategories: pendingSubcategories,
        }),
      });
      setNewCategoryName('');
      setPendingSubcategories([]);
      setPendingSubInput('');
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
      await adminFetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      await loadCategories();
    } catch (error) {
      alert('Error deleting category');
    }
  };

  const handleAddSubcategory = async (categoryId: string) => {
    if (!newSubcategoryName.trim()) return;
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const existing = category.subcategories || [];
    const trimmed = newSubcategoryName.trim();

    // Prevent duplicates (case-insensitive)
    if (existing.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      alert('This subcategory already exists.');
      return;
    }

    const updated = [...existing, trimmed];
    setSavingSubcategories(categoryId);
    try {
      await adminFetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        body: JSON.stringify({ subcategories: updated }),
      });
      setNewSubcategoryName('');
      await loadCategories();
    } catch (error) {
      alert('Error adding subcategory');
    } finally {
      setSavingSubcategories(null);
    }
  };

  const handleRemoveSubcategory = async (categoryId: string, subcategory: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const updated = (category.subcategories || []).filter(s => s !== subcategory);
    setSavingSubcategories(categoryId);
    try {
      await adminFetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        body: JSON.stringify({ subcategories: updated }),
      });
      await loadCategories();
    } catch (error) {
      alert('Error removing subcategory');
    } finally {
      setSavingSubcategories(null);
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

            {/* Subcategories inline builder */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[var(--navy)] font-bold opacity-50">
                Subcategories <span className="opacity-60">(optional)</span>
              </label>

              {/* Pending subcategory tags */}
              {pendingSubcategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {pendingSubcategories.map((sub) => (
                    <span 
                      key={sub}
                      className="inline-flex items-center gap-1 bg-[var(--navy)] text-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest"
                    >
                      {sub}
                      <button
                        type="button"
                        onClick={() => handleRemovePendingSub(sub)}
                        className="ml-0.5 hover:text-red-400 transition-colors text-xs leading-none"
                        title={`Remove ${sub}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Subcategory input row */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={pendingSubInput}
                  onChange={(e) => setPendingSubInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPendingSub();
                    }
                  }}
                  placeholder="e.g. Hoodies"
                  className="flex-1 border-2 border-[var(--navy)] p-2 font-bold uppercase tracking-widest text-[10px] outline-none focus:bg-[var(--navy)] focus:text-white transition-all rounded-none"
                />
                <button
                  type="button"
                  onClick={handleAddPendingSub}
                  disabled={!pendingSubInput.trim()}
                  className="bg-[var(--gold)] text-[var(--navy)] w-9 flex items-center justify-center font-black text-sm border-2 border-[var(--gold)] hover:bg-[var(--navy)] hover:text-white hover:border-[var(--navy)] transition-colors disabled:opacity-30"
                >
                  +
                </button>
              </div>
              <p className="text-[8px] uppercase tracking-wider text-[var(--navy)] opacity-35 font-bold">
                Press Enter or + to add. Visible as filters on storefront.
              </p>
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
              {categories.map((category) => {
                const isExpanded = expandedCategoryId === category.id;
                const subcategories = category.subcategories || [];

                return (
                  <div key={category.id} className="py-4">
                    <div className="flex justify-between items-center group">
                      <div className="flex-1 cursor-pointer" onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}>
                        <h3 className="text-lg font-black text-[var(--navy)] uppercase tracking-tight">
                          {category.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--navy)] opacity-40">
                            slug: {category.slug}
                          </p>
                          {subcategories.length > 0 && (
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--gold)]">
                              {subcategories.length} sub{subcategories.length === 1 ? '' : 's'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
                          className="border-2 border-[var(--navy)] text-[var(--navy)] px-3 py-2 font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--navy)] hover:text-white transition-all rounded-none"
                        >
                          {isExpanded ? 'Close' : 'Subs'}
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="border-2 border-red-600 text-red-600 px-4 py-2 font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all rounded-none"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Subcategories Panel */}
                    {isExpanded && (
                      <div className="mt-4 border-2 border-[var(--navy)] border-dashed p-4 bg-gray-50">
                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-[var(--navy)] opacity-60 mb-3">
                          Subcategories — visible as filters on storefront
                        </h4>

                        {/* Existing subcategories */}
                        {subcategories.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {subcategories.map((sub) => (
                              <span 
                                key={sub} 
                                className="inline-flex items-center gap-1.5 bg-[var(--navy)] text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
                              >
                                {sub}
                                <button
                                  onClick={() => handleRemoveSubcategory(category.id, sub)}
                                  disabled={savingSubcategories === category.id}
                                  className="ml-1 hover:text-red-400 transition-colors text-xs leading-none"
                                  title={`Remove ${sub}`}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] uppercase tracking-widest text-[var(--navy)] opacity-40 mb-4">
                            No subcategories yet. Add one below.
                          </p>
                        )}

                        {/* Add subcategory input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSubcategoryName}
                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSubcategory(category.id);
                              }
                            }}
                            placeholder="e.g. Hoodies"
                            className="flex-1 border-2 border-[var(--navy)] p-2 font-bold uppercase tracking-widest text-[10px] outline-none focus:bg-[var(--navy)] focus:text-white transition-all rounded-none"
                          />
                          <button
                            onClick={() => handleAddSubcategory(category.id)}
                            disabled={savingSubcategories === category.id || !newSubcategoryName.trim()}
                            className="bg-[var(--gold)] text-[var(--navy)] px-4 py-2 font-black uppercase tracking-widest text-[10px] hover:bg-[var(--navy)] hover:text-white transition-colors disabled:opacity-50"
                          >
                            {savingSubcategories === category.id ? '...' : 'Add'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
