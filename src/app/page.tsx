'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import SolutionCard from '@/components/SolutionCard';
import SolutionDetailModal from '@/components/SolutionDetailModal';
import SubmitSolutionModal from '@/components/SubmitSolutionModal';
import BrandsDirectory from '@/components/BrandsDirectory';
import { Brand, Solution, SolutionCategory, SheetConfigStatus } from '@/types';
import {
  Search,
  PlusCircle,
  SlidersHorizontal,
  X,
  Store,
  Layers,
  Code2,
  Sparkles,
  RefreshCw,
  Zap,
} from 'lucide-react';

const CATEGORIES: SolutionCategory[] = [
  'Theme / Liquid',
  'Checkout UI Extension',
  'Shopify Functions',
  'Custom App (Remix/Node)',
  'Shopify Flow & Webhook',
  'Metafields & Custom Data',
  '3rd-Party Integration',
  'Performance & CRO',
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'solutions' | 'brands' | 'submit'>('solutions');
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [status, setStatus] = useState<SheetConfigStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Modals
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Fetch initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resSol, resBrd, resStat] = await Promise.all([
        fetch('/api/solutions'),
        fetch('/api/brands'),
        fetch('/api/status'),
      ]);

      const solData = await resSol.json();
      const brdData = await resBrd.json();
      const statData = await resStat.json();

      if (solData.success) setSolutions(solData.data);
      if (brdData.success) setBrands(brdData.data);
      if (statData.success) setStatus(statData);
    } catch (err) {
      console.error('Failed to load portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Solutions
  const filteredSolutions = useMemo(() => {
    return solutions
      .filter((s) => {
        const matchesCategory =
          selectedCategory === 'All' || s.category === selectedCategory;

        const matchesBrand =
          selectedBrand === 'All' ||
          s.brandName.toLowerCase() === selectedBrand.toLowerCase();

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.brandName.toLowerCase().includes(q) ||
          s.problem.toLowerCase().includes(q) ||
          s.authorName.toLowerCase().includes(q) ||
          s.themeUsed.toLowerCase().includes(q) ||
          s.tags?.some((t) => t.toLowerCase().includes(q));

        return matchesCategory && matchesBrand && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return a.title.localeCompare(b.title);
      });
  }, [solutions, searchQuery, selectedCategory, selectedBrand, sortBy]);

  const handleBrandFilter = (brandName: string) => {
    setSelectedBrand(brandName);
    setActiveTab('solutions');
  };

  const handleSolutionAdded = (newSol: Solution) => {
    setSolutions((prev) => [newSol, ...prev]);
    // Also add to brands list if brand doesn't exist
    if (!brands.some((b) => b.name.toLowerCase() === newSol.brandName.toLowerCase())) {
      setBrands((prev) => [
        {
          id: `BRD-${String(Date.now()).slice(-4)}`,
          name: newSol.brandName,
          shopifyDomain: `${newSol.brandName.toLowerCase().replace(/\s+/g, '-')}.myshopify.com`,
          theme: newSol.themeUsed || 'Dawn',
          leadDeveloper: newSol.authorName,
          status: 'Active',
        },
        ...prev,
      ]);
    }
  };

  const handleBrandAdded = (newBrand: Brand) => {
    setBrands((prev) => [newBrand, ...prev]);
  };

  const hasActiveFilters =
    searchQuery !== '' || selectedCategory !== 'All' || selectedBrand !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand('All');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'submit') {
            setIsSubmitModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        status={status}
        totalSolutions={solutions.length}
        totalBrands={brands.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner / Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-black p-6 sm:p-10 text-white shadow-xl border border-neutral-800">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-neutral-300 border border-neutral-800">
              <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
              <span>Shopify Knowledge Base</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              Centralized Custom Solutions for 60+ Shopify Brands
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Explore theme modifications, Checkout UI extensions, Shopify Functions, and custom apps built across all partner stores.
            </p>

            {/* Quick Stats Ribbon */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 bg-neutral-900 px-3.5 py-1.5 rounded-xl border border-neutral-800">
                <Store className="w-4 h-4 text-neutral-300" />
                <span className="font-bold text-white">{brands.length}</span>
                <span className="text-neutral-400">Brands</span>
              </div>
              <div className="flex items-center gap-2 bg-neutral-900 px-3.5 py-1.5 rounded-xl border border-neutral-800">
                <Layers className="w-4 h-4 text-neutral-300" />
                <span className="font-bold text-white">{solutions.length}</span>
                <span className="text-neutral-400">Custom Solutions Logged</span>
              </div>
              <div className="flex items-center gap-2 bg-neutral-900 px-3.5 py-1.5 rounded-xl border border-neutral-800">
                <Zap className="w-4 h-4 text-neutral-300" />
                <span className="font-bold text-white">100%</span>
                <span className="text-neutral-400">Code Reusability</span>
              </div>
            </div>
          </div>

          {/* Decorative subtle ambient background */}
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-neutral-800/30 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* View Switcher: Solutions vs Brands */}
        {activeTab === 'brands' ? (
          <BrandsDirectory
            brands={brands}
            solutions={solutions}
            onSelectBrandForFilter={handleBrandFilter}
            onBrandAdded={handleBrandAdded}
          />
        ) : (
          <div className="space-y-6">
            {/* Search, Filter & Sort Bar */}
            <div className="bg-white dark:bg-neutral-950 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by solution name, brand, problem, tag, or developer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter by Brand Dropdown */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 min-w-[180px]">
                    <Store className="w-4 h-4 text-neutral-400 shrink-0" />
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full py-2.5 px-3 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 font-medium"
                    >
                      <option value="All">All Brands ({brands.length})</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-1.5 min-w-[150px]">
                    <SlidersHorizontal className="w-4 h-4 text-neutral-400 shrink-0" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
                      className="w-full py-2.5 px-3 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 font-medium"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="title">Title (A-Z)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Log Solution</span>
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar text-xs">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm font-semibold'
                      : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-800'
                  }`}
                >
                  All Categories ({solutions.length})
                </button>

                {CATEGORIES.map((cat) => {
                  const count = solutions.filter((s) => s.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
                        selectedCategory === cat
                          ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm font-semibold'
                          : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-800'
                      }`}
                    >
                      {cat} {count > 0 ? `(${count})` : ''}
                    </button>
                  );
                })}
              </div>

              {/* Filter feedback & Clear button */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                  <span className="text-neutral-500">
                    Showing <strong className="text-neutral-900 dark:text-white">{filteredSolutions.length}</strong> of {solutions.length} solutions
                    {selectedBrand !== 'All' && ` for ${selectedBrand}`}
                    {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-neutral-950 dark:text-white font-semibold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              )}
            </div>

            {/* Solutions Grid */}
            {isLoading ? (
              <div className="text-center py-24 space-y-3">
                <div className="w-8 h-8 border-4 border-neutral-300 dark:border-neutral-700 border-t-black dark:border-t-white rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-neutral-500">Loading custom solutions catalog...</p>
              </div>
            ) : filteredSolutions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSolutions.map((solution) => (
                  <SolutionCard
                    key={solution.id}
                    solution={solution}
                    onSelect={(sol) => setSelectedSolution(sol)}
                    onFilterBrand={handleBrandFilter}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-4">
                <Code2 className="w-12 h-12 text-neutral-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {solutions.length === 0
                      ? 'No custom solutions logged yet'
                      : 'No matching custom solutions found'}
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto">
                    {solutions.length === 0
                      ? 'Your database is fresh and ready. Click "+ Log Solution" to save your first custom Shopify feature!'
                      : 'Try adjusting your search keywords, clearing filters, or log this custom solution for your team.'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  {solutions.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
                  >
                    + Log New Solution
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-xs text-neutral-500 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <div>
            Shopify Custom Solutions Hub • Centralized Team Repository
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SolutionDetailModal
        solution={selectedSolution}
        onClose={() => setSelectedSolution(null)}
        onFilterBrand={handleBrandFilter}
      />

      <SubmitSolutionModal
        brands={brands}
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSolutionAdded={handleSolutionAdded}
      />
    </div>
  );
}
