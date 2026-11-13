'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import SolutionCard from '@/components/SolutionCard';
import SolutionDetailModal from '@/components/SolutionDetailModal';
import SubmitSolutionModal from '@/components/SubmitSolutionModal';
import BrandsDirectory from '@/components/BrandsDirectory';
import Leaderboard from '@/components/Leaderboard';
import { getContributorRankings } from '@/lib/contributors';
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
  Trophy,
  User,
  Crown,
  ArrowRight,
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
  'QA & Automation',
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'solutions' | 'brands' | 'leaderboard' | 'submit'>('solutions');
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [status, setStatus] = useState<SheetConfigStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('All');
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

  // Compute Contributor Rankings
  const contributors = useMemo(() => getContributorRankings(solutions), [solutions]);
  const topContributor = contributors[0] || null;

  // Build lookup maps for rank and badge by author name (case-insensitive)
  const { rankMap, badgeMap } = useMemo(() => {
    const rMap: Record<string, number> = {};
    const bMap: Record<string, string> = {};
    contributors.forEach((c) => {
      const key = c.name.toLowerCase();
      rMap[key] = c.rank;
      bMap[key] = c.badge;
    });
    return { rankMap: rMap, badgeMap: bMap };
  }, [contributors]);

  // Filter Solutions
  const filteredSolutions = useMemo(() => {
    return solutions
      .filter((s) => {
        const matchesCategory =
          selectedCategory === 'All' || s.category === selectedCategory;

        const matchesBrand =
          selectedBrand === 'All' ||
          s.brandName.toLowerCase() === selectedBrand.toLowerCase();

        const matchesAuthor =
          selectedAuthor === 'All' ||
          s.authorName.toLowerCase() === selectedAuthor.toLowerCase();

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.brandName.toLowerCase().includes(q) ||
          s.problem.toLowerCase().includes(q) ||
          s.authorName.toLowerCase().includes(q) ||
          s.themeUsed.toLowerCase().includes(q) ||
          s.tags?.some((t) => t.toLowerCase().includes(q));

        return matchesCategory && matchesBrand && matchesAuthor && matchesSearch;
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
  }, [solutions, searchQuery, selectedCategory, selectedBrand, selectedAuthor, sortBy]);

  const handleBrandFilter = (brandName: string) => {
    setSelectedBrand(brandName);
    setActiveTab('solutions');
  };

  const handleAuthorFilter = (authorName: string) => {
    setSelectedAuthor(authorName);
    setActiveTab('solutions');
  };

  const handleSolutionAdded = (newSol: Solution) => {
    setSolutions((prev) => [newSol, ...prev]);
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
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedBrand !== 'All' ||
    selectedAuthor !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedAuthor('All');
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] text-[#25364A] flex flex-col font-sans">
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
        totalContributors={contributors.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner / Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-[#25364A] p-6 sm:p-10 text-white shadow-xl border border-[#25364A]">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#EAF5FF]/20 text-[#70B7FF] border border-[#70B7FF]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#70B7FF]" />
              <span>Shopify Knowledge Base</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              Centralized Custom Solutions for 60+ Shopify Brands
            </h1>
            <p className="text-sm sm:text-base text-[#EAF5FF]/80 leading-relaxed">
              Explore theme modifications, Checkout UI extensions, Shopify Functions, and custom apps built across all partner stores.
            </p>

            {/* Quick Stats Ribbon */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 bg-[#1b2838] px-3.5 py-1.5 rounded-xl border border-[#354c68]">
                <Store className="w-4 h-4 text-[#70B7FF]" />
                <span className="font-bold text-white">{brands.length}</span>
                <span className="text-[#EAF5FF]/70">Brands</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1b2838] px-3.5 py-1.5 rounded-xl border border-[#354c68]">
                <Layers className="w-4 h-4 text-[#318CE7]" />
                <span className="font-bold text-white">{solutions.length}</span>
                <span className="text-[#EAF5FF]/70">Custom Solutions Logged</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1b2838] px-3.5 py-1.5 rounded-xl border border-[#354c68]">
                <User className="w-4 h-4 text-[#70B7FF]" />
                <span className="font-bold text-white">{contributors.length}</span>
                <span className="text-[#EAF5FF]/70">Contributors</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1b2838] px-3.5 py-1.5 rounded-xl border border-[#354c68]">
                <Zap className="w-4 h-4 text-[#318CE7]" />
                <span className="font-bold text-white">100%</span>
                <span className="text-[#EAF5FF]/70">Code Reusability</span>
              </div>
            </div>

            {/* Top Contributor Recognition Ribbon */}
            {topContributor && (
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#318CE7] text-white flex items-center justify-center font-bold shadow-md shadow-[#318CE7]/30 shrink-0">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#70B7FF] font-bold">
                        #1 Top Contributor Spotlight
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5FF] text-[#25364A]">
                        {topContributor.badge}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                      <span>{topContributor.name}</span>
                      <span className="text-xs font-normal text-[#EAF5FF]/70">
                        • {topContributor.solutionsCount} {topContributor.solutionsCount === 1 ? 'solution' : 'solutions'} logged across {topContributor.brandsHelpedCount} {topContributor.brandsHelpedCount === 1 ? 'brand' : 'brands'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Secondary Button: #70B7FF */}
                  <button
                    onClick={() => handleAuthorFilter(topContributor.name)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#70B7FF] hover:bg-[#5aa9f7] text-[#25364A] transition-colors shadow-sm"
                  >
                    View Solutions
                  </button>
                  {/* Primary Action Button: #318CE7 */}
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#318CE7] hover:bg-[#2478CC] text-white transition-colors flex items-center gap-1.5 shadow-sm shadow-[#318CE7]/20"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>View Leaderboard</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Decorative subtle ambient background */}
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-[#318CE7]/15 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* View Switcher: Solutions vs Brands vs Leaderboard */}
        {activeTab === 'brands' ? (
          <BrandsDirectory
            brands={brands}
            solutions={solutions}
            onSelectBrandForFilter={handleBrandFilter}
            onBrandAdded={handleBrandAdded}
          />
        ) : activeTab === 'leaderboard' ? (
          <Leaderboard
            contributors={contributors}
            totalSolutions={solutions.length}
            onSelectContributor={handleAuthorFilter}
            onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
          />
        ) : (
          <div className="space-y-6">
            {/* Search, Filter & Sort Bar */}
            <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E3EDF7] shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#25364A]/40" />
                  <input
                    type="text"
                    placeholder="Search by solution name, brand, problem, tag, or developer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-[#E3EDF7] bg-[#F8FBFF] text-[#25364A] placeholder:text-[#25364A]/40 focus:outline-none focus:ring-2 focus:ring-[#318CE7]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#25364A]/40 hover:text-[#25364A]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Filter by Brand Dropdown */}
                  <div className="flex items-center gap-1.5 min-w-[160px]">
                    <Store className="w-4 h-4 text-[#318CE7] shrink-0" />
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full py-2.5 px-3 text-xs rounded-xl border border-[#E3EDF7] bg-[#F8FBFF] text-[#25364A] focus:outline-none focus:ring-2 focus:ring-[#318CE7] font-semibold"
                    >
                      <option value="All">All Brands ({brands.length})</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Contributor Dropdown */}
                  <div className="flex items-center gap-1.5 min-w-[170px]">
                    <User className="w-4 h-4 text-[#318CE7] shrink-0" />
                    <select
                      value={selectedAuthor}
                      onChange={(e) => setSelectedAuthor(e.target.value)}
                      className="w-full py-2.5 px-3 text-xs rounded-xl border border-[#E3EDF7] bg-[#F8FBFF] text-[#25364A] focus:outline-none focus:ring-2 focus:ring-[#318CE7] font-semibold"
                    >
                      <option value="All">All Contributors ({contributors.length})</option>
                      {contributors.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.rank === 1 ? '🥇 ' : c.rank === 2 ? '🥈 ' : c.rank === 3 ? '🥉 ' : ''}
                          {c.name} ({c.solutionsCount})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-1.5 min-w-[140px]">
                    <SlidersHorizontal className="w-4 h-4 text-[#25364A]/50 shrink-0" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
                      className="w-full py-2.5 px-3 text-xs rounded-xl border border-[#E3EDF7] bg-[#F8FBFF] text-[#25364A] focus:outline-none focus:ring-2 focus:ring-[#318CE7] font-semibold"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="title">Title (A-Z)</option>
                    </select>
                  </div>

                  {/* Primary Button (#318CE7 / Hover #2478CC) */}
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-[#318CE7] text-white hover:bg-[#2478CC] transition-colors shadow-md shadow-[#318CE7]/20 shrink-0"
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
                  className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-[#318CE7] text-white shadow-sm'
                      : 'bg-[#EAF5FF] text-[#25364A] hover:bg-[#FFFFFF] border border-[#E3EDF7]'
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
                      className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#318CE7] text-white shadow-sm'
                          : 'bg-[#EAF5FF] text-[#25364A] hover:bg-[#FFFFFF] border border-[#E3EDF7]'
                      }`}
                    >
                      {cat} {count > 0 ? `(${count})` : ''}
                    </button>
                  );
                })}
              </div>

              {/* Filter feedback & Clear button */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-2 border-t border-[#E3EDF7] text-xs">
                  <span className="text-[#25364A]/70">
                    Showing <strong className="text-[#25364A]">{filteredSolutions.length}</strong> of {solutions.length} solutions
                    {selectedBrand !== 'All' && ` for ${selectedBrand}`}
                    {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                    {selectedAuthor !== 'All' && (
                      <span>
                        {' '}by <strong className="text-[#25364A]">{selectedAuthor}</strong>
                      </span>
                    )}
                  </span>
                  {/* Secondary Action Link */}
                  <button
                    onClick={clearFilters}
                    className="text-[#318CE7] font-bold hover:underline flex items-center gap-1"
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
                <div className="w-8 h-8 border-4 border-[#EAF5FF] border-t-[#318CE7] rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-[#25364A]/60">Loading custom solutions catalog...</p>
              </div>
            ) : filteredSolutions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSolutions.map((solution) => (
                  <SolutionCard
                    key={solution.id}
                    solution={solution}
                    onSelect={(sol) => setSelectedSolution(sol)}
                    onFilterBrand={handleBrandFilter}
                    onFilterAuthor={handleAuthorFilter}
                    authorRank={rankMap[solution.authorName.toLowerCase()]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#FFFFFF] rounded-3xl border border-[#E3EDF7] p-8 space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5FF] border border-[#E3EDF7] flex items-center justify-center mx-auto text-[#318CE7]">
                  <Code2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#25364A]">
                    {solutions.length === 0
                      ? 'No custom solutions logged yet'
                      : 'No matching custom solutions found'}
                  </h3>
                  <p className="text-xs text-[#25364A]/60 max-w-md mx-auto leading-relaxed">
                    {solutions.length === 0
                      ? 'Your database is fresh and ready. Click "+ Log Solution" to save your first custom Shopify feature and take the #1 spot on the leaderboard!'
                      : 'Try adjusting your search keywords, clearing filters, or log this custom solution for your team.'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  {solutions.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#EAF5FF] text-[#25364A] hover:bg-[#FFFFFF] border border-[#E3EDF7]"
                    >
                      Clear Filters
                    </button>
                  )}
                  {/* Primary Action Button (#318CE7 / Hover #2478CC) */}
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#318CE7] text-white hover:bg-[#2478CC] shadow-md shadow-[#318CE7]/20"
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
      <footer className="border-t border-[#E3EDF7] py-6 text-center text-xs text-[#25364A]/60 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <div className="font-medium">
            Shopify Custom Solutions Hub • Centralized Team Repository
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SolutionDetailModal
        solution={selectedSolution}
        onClose={() => setSelectedSolution(null)}
        onFilterBrand={handleBrandFilter}
        onFilterAuthor={handleAuthorFilter}
        authorRank={selectedSolution ? rankMap[selectedSolution.authorName.toLowerCase()] : undefined}
        authorBadge={selectedSolution ? badgeMap[selectedSolution.authorName.toLowerCase()] : undefined}
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
