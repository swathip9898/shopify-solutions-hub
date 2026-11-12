'use client';

import React, { useState } from 'react';
import { ContributorStats, Solution } from '@/types';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Search,
  ArrowRight,
  Store,
  Layers,
  Sparkles,
  Zap,
  Code2,
  Calendar,
  Flame,
} from 'lucide-react';

interface LeaderboardProps {
  contributors: ContributorStats[];
  totalSolutions: number;
  onSelectContributor: (authorName: string) => void;
  onOpenSubmitModal: () => void;
}

export default function Leaderboard({
  contributors,
  totalSolutions,
  onSelectContributor,
  onOpenSubmitModal,
}: LeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContributors = contributors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.topCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const top1 = contributors[0];
  const top2 = contributors[1];
  const top3 = contributors[2];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-black text-white p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-neutral-300 border border-neutral-800">
            <Trophy className="w-3.5 h-3.5 text-neutral-300" />
            <span>Developer Hall of Fame</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Top Solutions Contributors
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Rewarding the engineers building reusable Shopify solutions across 60+ brand stores. Log solutions to level up your rank and claim the #1 spot!
          </p>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Podium for Top 3 (if at least 1 contributor exists) */}
      {contributors.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-neutral-950 dark:text-white" />
                Champions Podium
              </h3>
              <p className="text-xs text-neutral-500">
                Leading contributors recognized for highest code impact & store coverage
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              {contributors.length} {contributors.length === 1 ? 'Contributor' : 'Active Contributors'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            {/* 2nd Place */}
            {top2 ? (
              <div className="order-2 md:order-1 bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm hover:border-neutral-400 transition-all text-center flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-black text-lg mb-3 shadow-inner">
                    <Medal className="w-6 h-6 text-neutral-500" />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-neutral-400">
                    Rank #2 • Runner Up
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                    {top2.name}
                  </h4>
                  <div className="inline-block px-2.5 py-0.5 mt-1 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800">
                    {top2.badge}
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-2 text-xs text-left">
                    <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                      <div className="text-neutral-400 text-[10px]">Solutions</div>
                      <div className="text-base font-bold text-neutral-900 dark:text-white">
                        {top2.solutionsCount}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                      <div className="text-neutral-400 text-[10px]">Brands Helped</div>
                      <div className="text-base font-bold text-neutral-900 dark:text-white">
                        {top2.brandsHelpedCount}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectContributor(top2.name)}
                  className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="order-2 md:order-1 hidden md:flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-center text-xs text-neutral-400 min-h-[220px]">
                <Medal className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-2" />
                <span>#2 Spot Available</span>
                <span className="text-[11px] text-neutral-500 mt-1">Log solutions to claim this spot!</span>
              </div>
            )}

            {/* 1st Place - Grand Champion */}
            {top1 && (
              <div className="order-1 md:order-2 bg-black text-white rounded-3xl border-2 border-white/80 p-6 shadow-2xl relative flex flex-col justify-between transform md:-translate-y-2">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black font-black text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                  <Crown className="w-3.5 h-3.5" />
                  <span>#1 MVP Champion</span>
                </div>

                <div className="text-center pt-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-black font-black text-2xl mb-3 shadow-lg">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-white">
                    {top1.name}
                  </h4>
                  <div className="inline-block px-3 py-1 mt-1 rounded-full text-xs font-bold bg-neutral-900 text-neutral-200 border border-neutral-700">
                    {top1.badge}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-left">
                    <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                      <div className="text-neutral-400 text-[10px]">Total Logged</div>
                      <div className="text-xl font-black text-white">
                        {top1.solutionsCount}
                        <span className="text-[11px] font-normal text-neutral-400 ml-1">
                          ({totalSolutions > 0 ? Math.round((top1.solutionsCount / totalSolutions) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                      <div className="text-neutral-400 text-[10px]">Stores Helped</div>
                      <div className="text-xl font-black text-white">
                        {top1.brandsHelpedCount}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-[11px] text-neutral-300 flex items-center justify-between">
                    <span className="text-neutral-400">Primary Domain:</span>
                    <strong className="text-white font-mono">{top1.topCategory}</strong>
                  </div>
                </div>

                <button
                  onClick={() => onSelectContributor(top1.name)}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Explore {top1.name}&apos;s Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 3rd Place */}
            {top3 ? (
              <div className="order-3 bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm hover:border-neutral-400 transition-all text-center flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-black text-lg mb-3 shadow-inner">
                    <Award className="w-6 h-6 text-neutral-500" />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-neutral-400">
                    Rank #3 • Bronze
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                    {top3.name}
                  </h4>
                  <div className="inline-block px-2.5 py-0.5 mt-1 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800">
                    {top3.badge}
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-2 text-xs text-left">
                    <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                      <div className="text-neutral-400 text-[10px]">Solutions</div>
                      <div className="text-base font-bold text-neutral-900 dark:text-white">
                        {top3.solutionsCount}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                      <div className="text-neutral-400 text-[10px]">Brands Helped</div>
                      <div className="text-base font-bold text-neutral-900 dark:text-white">
                        {top3.brandsHelpedCount}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectContributor(top3.name)}
                  className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="order-3 hidden md:flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-center text-xs text-neutral-400 min-h-[220px]">
                <Award className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-2" />
                <span>#3 Spot Available</span>
                <span className="text-[11px] text-neutral-500 mt-1">Log solutions to enter the podium!</span>
              </div>
            )}
          </div>

          {/* Full Contributor Rankings Table & Search */}
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-neutral-500" />
                Full Contributor Leaderboard
              </h3>

              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search contributor name or domain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-mono text-[11px]">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Contributor</th>
                    <th className="py-2.5 px-3">Badge & Title</th>
                    <th className="py-2.5 px-3 text-center">Solutions</th>
                    <th className="py-2.5 px-3">Primary Tech</th>
                    <th className="py-2.5 px-3">Brands Impacted</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                  {filteredContributors.map((c) => (
                    <tr
                      key={c.name}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors group"
                    >
                      {/* Rank */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black ${
                            c.rank === 1
                              ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                              : c.rank === 2
                              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                              : c.rank === 3
                              ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700'
                              : 'text-neutral-400 font-mono'
                          }`}
                        >
                          {c.rank === 1 ? '🥇' : c.rank === 2 ? '🥈' : c.rank === 3 ? '🥉' : c.rank}
                        </span>
                      </td>

                      {/* Contributor Name */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-neutral-900 dark:text-white">
                          {c.name}
                        </div>
                        {c.email && (
                          <div className="text-[10px] text-neutral-400 truncate max-w-[160px]">
                            {c.email}
                          </div>
                        )}
                      </td>

                      {/* Badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            c.rank === 1
                              ? 'bg-black dark:bg-white text-white dark:text-black border-transparent'
                              : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800'
                          }`}
                        >
                          {c.badge}
                        </span>
                      </td>

                      {/* Solutions count */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white">
                          {c.solutionsCount}
                        </span>
                        <div className="w-16 bg-neutral-100 dark:bg-neutral-900 h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                          <div
                            className="bg-neutral-900 dark:bg-white h-full rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((c.solutionsCount / (top1?.solutionsCount || 1)) * 100)
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </td>

                      {/* Primary Tech */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded text-[11px] border border-neutral-200/60 dark:border-neutral-800">
                          {c.topCategory}
                        </span>
                      </td>

                      {/* Brands Helped */}
                      <td className="py-3 px-3">
                        <div className="text-neutral-700 dark:text-neutral-300 font-medium">
                          {c.brandsHelpedCount} {c.brandsHelpedCount === 1 ? 'store' : 'stores'}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">
                          {c.brandsHelped.slice(0, 2).join(', ')}
                          {c.brandsHelped.length > 2 && ` +${c.brandsHelped.length - 2} more`}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onSelectContributor(c.name)}
                          className="inline-flex items-center gap-1 font-semibold text-neutral-900 dark:text-white hover:underline text-xs"
                        >
                          <span>Solutions</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredContributors.length === 0 && (
              <div className="text-center py-8 text-neutral-400 text-xs">
                No contributors found matching &ldquo;{searchTerm}&rdquo;.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mx-auto text-neutral-400 border border-neutral-200 dark:border-neutral-800">
            <Trophy className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              The Leaderboard is Wide Open!
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              No solutions have been logged yet. Be the first contributor to log a custom Shopify snippet, theme tweak, or app to claim the #1 Champion spot!
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onOpenSubmitModal}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
            >
              + Log First Solution & Claim #1
            </button>
          </div>
        </div>
      )}

      {/* Rewards & Recognition Criteria Banner */}
      <div className="bg-neutral-50 dark:bg-neutral-950/60 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neutral-400" />
          How Rankings & Rewards Work
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
            <div className="font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span>🥇</span> #1 Champion Spotlight
            </div>
            <p className="text-[11px] leading-relaxed">
              The engineer with the most logged solutions is prominently featured on the homepage hero banner across the entire team portal.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
            <div className="font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span>🎖️</span> Contributor Badges
            </div>
            <p className="text-[11px] leading-relaxed">
              Earn &ldquo;MVP Grand Architect&rdquo;, &ldquo;Master Builder&rdquo;, and &ldquo;Multi-Brand Specialist&rdquo; badges displayed next to your solutions.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
            <div className="font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span>🚀</span> Code Reusability Impact
            </div>
            <p className="text-[11px] leading-relaxed">
              Every feature logged saves hours for other developers across our 60+ partner stores and prevents duplicate work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
