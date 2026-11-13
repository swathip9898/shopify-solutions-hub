'use client';

import React from 'react';
import { Layers, Database, PlusCircle, Store, Trophy } from 'lucide-react';
import { SheetConfigStatus } from '@/types';

interface HeaderProps {
  activeTab: 'solutions' | 'brands' | 'leaderboard' | 'submit';
  setActiveTab: (tab: 'solutions' | 'brands' | 'leaderboard' | 'submit') => void;
  status: SheetConfigStatus | null;
  totalSolutions: number;
  totalBrands: number;
  totalContributors?: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  status,
  totalSolutions,
  totalBrands,
  totalContributors = 0,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#E3EDF7] text-[#25364A] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => setActiveTab('solutions')}
          >
            <div className="w-10 h-10 rounded-xl bg-[#318CE7] text-white flex items-center justify-center shadow-md shadow-[#318CE7]/20">
              <Layers className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-[#25364A]">
                  Shopify Hub
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EAF5FF] text-[#318CE7] px-2 py-0.5 rounded-full border border-[#E3EDF7]">
                  Team Portal
                </span>
              </div>
              <p className="text-xs text-[#25364A]/60">Custom Solutions Repository</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-[#EAF5FF] p-1.5 rounded-2xl border border-[#E3EDF7]">
            <button
              onClick={() => setActiveTab('solutions')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'solutions'
                  ? 'bg-[#318CE7] text-white shadow-sm'
                  : 'text-[#25364A]/70 hover:text-[#25364A] hover:bg-[#FFFFFF]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Solutions ({totalSolutions})</span>
            </button>

            <button
              onClick={() => setActiveTab('brands')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'brands'
                  ? 'bg-[#318CE7] text-white shadow-sm'
                  : 'text-[#25364A]/70 hover:text-[#25364A] hover:bg-[#FFFFFF]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Brands Directory ({totalBrands})</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-[#318CE7] text-white shadow-sm'
                  : 'text-[#25364A]/70 hover:text-[#25364A] hover:bg-[#FFFFFF]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Leaderboard {totalContributors > 0 ? `(${totalContributors})` : ''}</span>
            </button>
          </nav>

          {/* Database Status & Primary Action */}
          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                status?.isConfigured
                  ? 'bg-[#EAF5FF] border-[#E3EDF7] text-[#25364A]'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-500'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  status?.isConfigured
                    ? 'bg-[#318CE7] animate-pulse shadow-[0_0_8px_rgba(49,140,231,0.6)]'
                    : 'bg-neutral-400'
                }`}
              ></span>
              <span className="hidden sm:inline">
                {status?.isConfigured ? 'Sheet Connected' : 'Database Ready'}
              </span>
              <Database className="w-3.5 h-3.5 text-[#318CE7]" />
            </div>

            {/* Primary Action Button (#318CE7 / Hover #2478CC) */}
            <button
              onClick={() => setActiveTab('submit')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#318CE7] text-white hover:bg-[#2478CC] transition-all shadow-md shadow-[#318CE7]/20 hover:shadow-[#318CE7]/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">+ Log Solution</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-[#E3EDF7] text-xs">
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-3 py-1 rounded-lg font-bold ${
              activeTab === 'solutions' ? 'bg-[#318CE7] text-white' : 'text-[#25364A]/70'
            }`}
          >
            Solutions ({totalSolutions})
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-3 py-1 rounded-lg font-bold ${
              activeTab === 'brands' ? 'bg-[#318CE7] text-white' : 'text-[#25364A]/70'
            }`}
          >
            Brands ({totalBrands})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1 rounded-lg font-bold ${
              activeTab === 'leaderboard' ? 'bg-[#318CE7] text-white' : 'text-[#25364A]/70'
            }`}
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </header>
  );
}
