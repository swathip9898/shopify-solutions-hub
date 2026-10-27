'use client';

import React, { useState } from 'react';
import { Brand, Solution } from '@/types';
import {
  Store,
  ExternalLink,
  Search,
  PlusCircle,
  User,
  Layers,
  ArrowRight,
  X,
} from 'lucide-react';

interface BrandsDirectoryProps {
  brands: Brand[];
  solutions: Solution[];
  onSelectBrandForFilter: (brandName: string) => void;
  onBrandAdded: (newBrand: Brand) => void;
}

export default function BrandsDirectory({
  brands,
  solutions,
  onSelectBrandForFilter,
  onBrandAdded,
}: BrandsDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Brand Form State
  const [name, setName] = useState('');
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [theme, setTheme] = useState('Dawn (v14.0)');
  const [leadDeveloper, setLeadDeveloper] = useState('');
  const [accountManager, setAccountManager] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute solution count for each brand
  const getSolutionCount = (brandName: string) => {
    return solutions.filter(
      (s) => s.brandName.toLowerCase() === brandName.toLowerCase()
    ).length;
  };

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.shopifyDomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.leadDeveloper.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Brand Name is required.');
      return;
    }
    if (!shopifyDomain.trim()) {
      setError('Shopify Domain (e.g. store.myshopify.com) is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          shopifyDomain: shopifyDomain.trim(),
          liveUrl: liveUrl.trim(),
          theme: theme.trim() || 'Dawn',
          leadDeveloper: leadDeveloper.trim() || 'Unassigned',
          accountManager: accountManager.trim(),
          notes: notes.trim(),
          status: 'Active',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save brand.');
      }

      onBrandAdded(data.data);
      setIsAddModalOpen(false);
      setName('');
      setShopifyDomain('');
      setLiveUrl('');
      setLeadDeveloper('');
      setAccountManager('');
      setNotes('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-500" />
            Brands Directory ({brands.length} Total)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track Shopify themes, leads, and custom builds across our partner stores
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by brand, theme, or lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Brand</span>
          </button>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBrands.map((brand) => {
          const solutionCount = getSolutionCount(brand.name);
          return (
            <div
              key={brand.id}
              className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                      {brand.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {brand.name}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {brand.id}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                      brand.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}
                  >
                    {brand.status}
                  </span>
                </div>

                {/* Shopify Domain & Live URL */}
                <div className="space-y-1 mb-4 text-xs font-mono">
                  <div className="text-slate-500 truncate">
                    🏬 {brand.shopifyDomain}
                  </div>
                  {brand.liveUrl && (
                    <a
                      href={brand.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <span>{brand.liveUrl.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Theme & Lead Developer */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Theme:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {brand.theme}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Lead Dev:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <User className="w-3 h-3 text-emerald-500" />
                      {brand.leadDeveloper}
                    </span>
                  </div>
                  {brand.accountManager && (
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>AM:</span>
                      <span>{brand.accountManager}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action: Solutions Count */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" />
                  <strong>{solutionCount}</strong> custom {solutionCount === 1 ? 'solution' : 'solutions'}
                </span>

                <button
                  onClick={() => onSelectBrandForFilter(brand.name)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
                >
                  <span>Filter solutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBrands.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Store className="w-10 h-10 text-slate-400 mx-auto" />
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {searchTerm ? `No brands matched "${searchTerm}"` : 'No brands added yet'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {searchTerm ? 'Try another search keyword.' : 'Click "+ Add Brand" to register your first Shopify store.'}
            </p>
          </div>
          {!searchTerm && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add First Brand</span>
            </button>
          )}
        </div>
      )}

      {/* Add Brand Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-500" />
                Add Shopify Brand
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 text-xs border border-rose-500/20">
                {error}
              </div>
            )}

            <form onSubmit={handleAddBrandSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gymshark"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Shopify Domain *
                </label>
                <input
                  type="text"
                  placeholder="e.g. brand-name.myshopify.com"
                  value={shopifyDomain}
                  onChange={(e) => setShopifyDomain(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Theme Used
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dawn (v14.0)"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lead Developer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera"
                    value={leadDeveloper}
                    onChange={(e) => setLeadDeveloper(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Live Website URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://brandname.com"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
