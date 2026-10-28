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
    <header className="sticky top-0 z-30 bg-black border-b border-neutral-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('solutions')}>
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">Shopify Hub</span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700">
                  Team Portal
                </span>
              </div>
              <p className="text-xs text-neutral-400">Custom Solutions Repository</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('solutions')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'solutions'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Solutions ({totalSolutions})</span>
            </button>

            <button
              onClick={() => setActiveTab('brands')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'brands'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Brands Directory ({totalBrands})</span>
            </button>

            <button
              onClick={() => setActiveTab('submit')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'submit'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add Solution</span>
            </button>
          </nav>

          {/* Database Status */}
          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium border ${
                status?.isConfigured
                  ? 'bg-neutral-900 border-neutral-700 text-neutral-200'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  status?.isConfigured
                    ? 'bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                    : 'bg-neutral-600'
                }`}
              ></span>
              <span className="hidden sm:inline">
                {status?.isConfigured ? 'Google Sheet Connected' : 'Database Ready'}
              </span>
              <Database className="w-3.5 h-3.5 ml-1 text-neutral-400" />
            </div>

            <button
              onClick={() => setActiveTab('submit')}
              className="md:hidden flex items-center justify-center p-2 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'solutions' ? 'bg-white text-black font-bold' : 'text-neutral-400'}`}
          >
            Solutions ({totalSolutions})
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'brands' ? 'bg-white text-black font-bold' : 'text-neutral-400'}`}
          >
            Brands ({totalBrands})
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'submit' ? 'bg-white text-black font-bold' : 'text-neutral-300'}`}
          >
            + Add New
          </button>
        </div>
      </div>
    </header>
  );
}
