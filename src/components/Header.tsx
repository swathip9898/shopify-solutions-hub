'use client';

import React from 'react';
import { Layers, Database, PlusCircle, Store } from 'lucide-react';
import { SheetConfigStatus } from '@/types';

interface HeaderProps {
  activeTab: 'solutions' | 'brands' | 'submit';
  setActiveTab: (tab: 'solutions' | 'brands' | 'submit') => void;
  status: SheetConfigStatus | null;
  totalSolutions: number;
  totalBrands: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  status,
  totalSolutions,
  totalBrands,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('solutions')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Layers className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">Shopify Hub</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Team Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">Internal Custom Solutions Repository</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('solutions')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'solutions'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Solutions ({totalSolutions})</span>
            </button>

            <button
              onClick={() => setActiveTab('brands')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'brands'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Brands Directory ({totalBrands})</span>
            </button>

            <button
              onClick={() => setActiveTab('submit')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'submit'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Solution</span>
            </button>
          </nav>

          {/* Database Status */}
          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-medium border ${
                status?.isConfigured
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  status?.isConfigured
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-slate-500'
                }`}
              ></span>
              <span className="hidden sm:inline">
                {status?.isConfigured ? 'Google Sheet Connected' : 'Database Ready'}
              </span>
              <Database className="w-3.5 h-3.5 ml-1 text-emerald-400" />
            </div>

            <button
              onClick={() => setActiveTab('submit')}
              className="md:hidden flex items-center justify-center p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-3 py-1 rounded ${activeTab === 'solutions' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Solutions ({totalSolutions})
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-3 py-1 rounded ${activeTab === 'brands' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Brands ({totalBrands})
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3 py-1 rounded ${activeTab === 'submit' ? 'text-emerald-400 font-bold' : 'text-emerald-400'}`}
          >
            + Add New
          </button>
        </div>
      </div>
    </header>
  );
}
