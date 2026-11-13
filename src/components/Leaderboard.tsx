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
      <div className="bg-[#25364A] text-white p-6 sm:p-8 rounded-3xl border border-[#25364A] shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5FF]/20 text-[#70B7FF] border border-[#70B7FF]/40">
            <Trophy className="w-3.5 h-3.5 text-[#70B7FF]" />
            <span>Developer Hall of Fame</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Top Solutions Contributors
          </h2>
          <p className="text-sm text-[#EAF5FF]/80 leading-relaxed">
            Rewarding the engineers building reusable Shopify solutions across 60+ brand stores. Log solutions to level up your rank and claim the #1 spot!
          </p>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#318CE7]/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Podium for Top 3 (if at least 1 contributor exists) */}
      {contributors.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#25364A] flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#318CE7]" />
                Champions Podium
              </h3>
              <p className="text-xs text-[#25364A]/60">
                Leading contributors recognized for highest code impact & store coverage
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#25364A]/60">
              {contributors.length} {contributors.length === 1 ? 'Contributor' : 'Active Contributors'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            {/* 2nd Place */}
            {top2 ? (
              <div className="order-2 md:order-1 bg-[#FFFFFF] rounded-2xl border border-[#E3EDF7] p-5 shadow-sm hover:shadow-lg hover:border-[#70B7FF] transition-all text-center flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EAF5FF] border border-[#E3EDF7] text-[#70B7FF] font-black text-lg mb-3 shadow-inner">
                    <Medal className="w-6 h-6 text-[#70B7FF]" />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#25364A]/50">
                    Rank #2 • Runner Up
                  </div>
                  <h4 className="text-lg font-bold text-[#25364A] mt-1">
                    {top2.name}
                  </h4>
                  <div className="inline-block px-2.5 py-0.5 mt-1 rounded-full text-[11px] font-bold bg-[#EAF5FF] text-[#25364A] border border-[#E3EDF7]">
                    {top2.badge}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#E3EDF7] grid grid-cols-2 gap-2 text-xs text-left">
                    <div className="p-2.5 rounded-xl bg-[#EAF5FF] border border-[#E3EDF7]">
                      <div className="text-[#25364A]/60 text-[10px] font-semibold">Solutions</div>
                      <div className="text-base font-bold text-[#25364A]">
                        {top2.solutionsCount}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#EAF5FF] border border-[#E3EDF7]">
                      <div className="text-[#25364A]/60 text-[10px] font-semibold">Brands Helped</div>
                      <div className="text-base font-bold text-[#25364A]">
                        {top2.brandsHelpedCount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Action Button (#70B7FF) */}
                <button
                  onClick={() => onSelectContributor(top2.name)}
                  className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#70B7FF] text-white hover:bg-[#5aa9f7] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>View Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="order-2 md:order-1 hidden md:flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#E3EDF7] rounded-2xl text-center text-xs text-[#25364A]/50 min-h-[220px] bg-[#FFFFFF]">
                <Medal className="w-8 h-8 text-[#70B7FF] mb-2" />
                <span className="font-bold text-[#25364A]">#2 Spot Available</span>
                <span className="text-[11px] text-[#25364A]/60 mt-1">Log solutions to claim this spot!</span>
              </div>
            )}

            {/* 1st Place - Grand Champion */}
            {top1 && (
              <div className="order-1 md:order-2 bg-[#25364A] text-white rounded-3xl border-2 border-[#318CE7] p-6 shadow-2xl relative flex flex-col justify-between transform md:-translate-y-2">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#318CE7] text-white font-black text-[11px] px-3.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#318CE7]/30">
                  <Crown className="w-3.5 h-3.5" />
                  <span>#1 MVP Champion</span>
                </div>

                <div className="text-center pt-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#318CE7] text-white font-black text-2xl mb-3 shadow-lg shadow-[#318CE7]/30">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-white">
                    {top1.name}
                  </h4>
                  <div className="inline-block px-3 py-1 mt-1 rounded-full text-xs font-bold bg-[#EAF5FF] text-[#25364A]">
                    {top1.badge}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-left">
                    <div className="p-3 rounded-2xl bg-[#1b2838] border border-[#354c68]">
                      <div className="text-[#EAF5FF]/60 text-[10px] font-semibold">Total Logged</div>
                      <div className="text-xl font-black text-white">
                        {top1.solutionsCount}
                        <span className="text-[11px] font-normal text-[#EAF5FF]/70 ml-1">
                          ({totalSolutions > 0 ? Math.round((top1.solutionsCount / totalSolutions) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#1b2838] border border-[#354c68]">
                      <div className="text-[#EAF5FF]/60 text-[10px] font-semibold">Stores Helped</div>
                      <div className="text-xl font-black text-white">
                        {top1.brandsHelpedCount}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-[#1b2838]/80 border border-[#354c68] text-[11px] text-[#EAF5FF]/80 flex items-center justify-between">
                    <span className="text-[#EAF5FF]/60">Primary Domain:</span>
                    <strong className="text-white font-mono">{top1.topCategory}</strong>
                  </div>
                </div>

                {/* Primary Action Button (#318CE7 / Hover #2478CC) */}
                <button
                  onClick={() => onSelectContributor(top1.name)}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#318CE7] text-white hover:bg-[#2478CC] transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#318CE7]/30"
                >
                  <span>Explore {top1.name}&apos;s Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 3rd Place */}
            {top3 ? (
              <div className="order-3 bg-[#FFFFFF] rounded-2xl border border-[#E3EDF7] p-5 shadow-sm hover:shadow-lg hover:border-[#318CE7] transition-all text-center flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EAF5FF] border border-[#E3EDF7] text-[#318CE7] font-black text-lg mb-3 shadow-inner">
                    <Award className="w-6 h-6 text-[#318CE7]" />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#25364A]/50">
                    Rank #3 • Bronze
                  </div>
                  <h4 className="text-lg font-bold text-[#25364A] mt-1">
                    {top3.name}
                  </h4>
                  <div className="inline-block px-2.5 py-0.5 mt-1 rounded-full text-[11px] font-bold bg-[#EAF5FF] text-[#25364A] border border-[#E3EDF7]">
                    {top3.badge}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#E3EDF7] grid grid-cols-2 gap-2 text-xs text-left">
                    <div className="p-2.5 rounded-xl bg-[#EAF5FF] border border-[#E3EDF7]">
                      <div className="text-[#25364A]/60 text-[10px] font-semibold">Solutions</div>
                      <div className="text-base font-bold text-[#25364A]">
                        {top3.solutionsCount}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#EAF5FF] border border-[#E3EDF7]">
                      <div className="text-[#25364A]/60 text-[10px] font-semibold">Brands Helped</div>
                      <div className="text-base font-bold text-[#25364A]">
                        {top3.brandsHelpedCount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Action Button (#70B7FF) */}
                <button
                  onClick={() => onSelectContributor(top3.name)}
                  className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#70B7FF] text-white hover:bg-[#5aa9f7] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>View Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="order-3 hidden md:flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#E3EDF7] rounded-2xl text-center text-xs text-[#25364A]/50 min-h-[220px] bg-[#FFFFFF]">
                <Award className="w-8 h-8 text-[#70B7FF] mb-2" />
                <span className="font-bold text-[#25364A]">#3 Spot Available</span>
                <span className="text-[11px] text-[#25364A]/60 mt-1">Log solutions to enter the podium!</span>
              </div>
            )}
          </div>

          {/* Full Contributor Rankings Table & Search */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E3EDF7] p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3EDF7]">
              <h3 className="text-sm font-bold text-[#25364A] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#318CE7]" />
                Full Contributor Leaderboard
              </h3>
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#25364A]/50" />
                <input
                  type="text"
                  placeholder="Search contributor name or domain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E3EDF7] bg-[#F8FBFF] text-[#25364A] placeholder:text-[#25364A]/40 focus:outline-none focus:ring-2 focus:ring-[#318CE7]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E3EDF7] text-[#25364A]/60 font-mono text-[11px]">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Contributor</th>
                    <th className="py-2.5 px-3">Badge & Title</th>
                    <th className="py-2.5 px-3 text-center">Solutions</th>
                    <th className="py-2.5 px-3">Primary Tech</th>
                    <th className="py-2.5 px-3">Brands Impacted</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3EDF7]">
                  {filteredContributors.map((c) => (
                    <tr
                      key={c.name}
                      className="hover:bg-[#EAF5FF]/60 transition-colors group"
                    >
                      {/* Rank */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black ${
                            c.rank === 1
                              ? 'bg-[#318CE7] text-white shadow-sm'
                              : c.rank === 2
                              ? 'bg-[#70B7FF] text-white shadow-sm'
                              : c.rank === 3
                              ? 'bg-[#EAF5FF] text-[#25364A] font-bold border border-[#E3EDF7]'
                              : 'text-[#25364A]/60 font-mono'
                          }`}
                        >
                          {c.rank === 1 ? '🥇' : c.rank === 2 ? '🥈' : c.rank === 3 ? '🥉' : c.rank}
                        </span>
                      </td>

                      {/* Contributor Name */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#25364A]">
                          {c.name}
                        </div>
                        {c.email && (
                          <div className="text-[10px] text-[#25364A]/50 truncate max-w-[160px]">
                            {c.email}
                          </div>
                        )}
                      </td>

                      {/* Badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            c.rank === 1
                              ? 'bg-[#318CE7] text-white border-transparent'
                              : 'bg-[#EAF5FF] text-[#25364A] border-[#E3EDF7]'
                          }`}
                        >
                          {c.badge}
                        </span>
                      </td>

                      {/* Solutions count */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-sm text-[#25364A]">
                          {c.solutionsCount}
                        </span>
                        <div className="w-16 bg-[#EAF5FF] border border-[#E3EDF7] h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                          <div
                            className="bg-[#318CE7] h-full rounded-full"
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
                        <span className="font-mono text-[#25364A] bg-[#EAF5FF] px-2 py-0.5 rounded text-[11px] border border-[#E3EDF7]">
                          {c.topCategory}
                        </span>
                      </td>

                      {/* Brands Helped */}
                      <td className="py-3 px-3">
                        <div className="text-[#25364A] font-bold">
                          {c.brandsHelpedCount} {c.brandsHelpedCount === 1 ? 'store' : 'stores'}
                        </div>
                        <div className="text-[10px] text-[#25364A]/50 truncate max-w-[140px]">
                          {c.brandsHelped.slice(0, 2).join(', ')}
                          {c.brandsHelped.length > 2 && ` +${c.brandsHelped.length - 2} more`}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        {/* Secondary Link (#318CE7) */}
                        <button
                          onClick={() => onSelectContributor(c.name)}
                          className="inline-flex items-center gap-1 font-bold text-[#318CE7] hover:underline text-xs"
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
              <div className="text-center py-8 text-[#25364A]/60 text-xs">
                No contributors found matching &ldquo;{searchTerm}&rdquo;.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-[#FFFFFF] rounded-3xl border border-[#E3EDF7] p-8 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF5FF] border border-[#E3EDF7] flex items-center justify-center mx-auto text-[#318CE7]">
            <Trophy className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#25364A]">
              The Leaderboard is Wide Open!
            </h3>
            <p className="text-xs text-[#25364A]/60 max-w-md mx-auto">
              No solutions have been logged yet. Be the first contributor to log a custom Shopify snippet, theme tweak, or app to claim the #1 Champion spot!
            </p>
          </div>
          <div className="pt-2">
            {/* Primary Action Button (#318CE7 / Hover #2478CC) */}
            <button
              onClick={onOpenSubmitModal}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#318CE7] text-white hover:bg-[#2478CC] transition-colors shadow-md shadow-[#318CE7]/20"
            >
              + Log First Solution & Claim #1
            </button>
          </div>
        </div>
      )}

      {/* Rewards & Recognition Criteria Banner */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E3EDF7] p-6 space-y-3 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#25364A] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#318CE7]" />
          How Rankings & Rewards Work
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#25364A]/70">
          <div className="p-3.5 rounded-xl bg-[#EAF5FF] border border-[#E3EDF7]">
            <div className="font-bold text-[#25364A] mb-1 flex items-center gap-1.5">
              <span>🥇</span> #1 Champion Spotlight
            </div>
            <p className="text-[11px] leading-relaxed">
              The engineer with the most logged solutions is prominently featured on the homepage hero banner across the entire team portal.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#EAF5FF] border border-[#E3EDF7]">
            <div className="font-bold text-[#25364A] mb-1 flex items-center gap-1.5">
              <span>🎖️</span> Contributor Badges
            </div>
            <p className="text-[11px] leading-relaxed">
              Earn &ldquo;MVP Grand Architect&rdquo;, &ldquo;Master Builder&rdquo;, and &ldquo;Multi-Brand Specialist&rdquo; badges displayed next to your solutions.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#EAF5FF] border border-[#E3EDF7]">
            <div className="font-bold text-[#25364A] mb-1 flex items-center gap-1.5">
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
