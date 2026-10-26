'use client';

import React, { useState } from 'react';
import { Solution, SolutionCategory } from '@/types';
import {
  Code,
  Copy,
  Check,
  Store,
  Calendar,
  User,
  ChevronRight,
} from 'lucide-react';

interface SolutionCardProps {
  solution: Solution;
  onSelect: (solution: Solution) => void;
  onFilterBrand?: (brandName: string) => void;
}

export function getCategoryBadgeColor(category: SolutionCategory): string {
  switch (category) {
    case 'Theme / Liquid':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'Checkout UI Extension':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    case 'Shopify Functions':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    case 'Custom App (Remix/Node)':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'Shopify Flow & Webhook':
      return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20';
    case 'Metafields & Custom Data':
      return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    case '3rd-Party Integration':
      return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
    case 'Performance & CRO':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
  }
}

export default function SolutionCard({ solution, onSelect, onFilterBrand }: SolutionCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (solution.codeSnippet) {
      navigator.clipboard.writeText(solution.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onSelect(solution)}
      className="group relative bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Top Badges & Meta */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFilterBrand?.(solution.brandName);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors border border-slate-200/60 dark:border-slate-700/60"
            >
              <Store className="w-3.5 h-3.5 text-emerald-500" />
              <span>{solution.brandName}</span>
            </button>

            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getCategoryBadgeColor(
                solution.category
              )}`}
            >
              {solution.category}
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 rounded">
            {solution.id}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-2 leading-snug mb-2">
          {solution.title}
        </h3>

        {/* Problem summary */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {solution.problem}
        </p>

        {/* Code Snippet Preview (if available) */}
        {solution.codeSnippet && (
          <div className="relative mb-4 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800/80 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span>Code Snippet</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                title="Copy snippet"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 font-mono text-slate-300 overflow-x-hidden text-[11px] max-h-24 opacity-80 group-hover:opacity-100 transition-opacity">
              <code>{solution.codeSnippet.slice(0, 150)}...</code>
            </pre>
          </div>
        )}

        {/* Tags */}
        {solution.tags && solution.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {solution.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-mono"
              >
                #{tag}
              </span>
            ))}
            {solution.tags.length > 3 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{solution.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Author & Action */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" title="Author">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {solution.authorName}
            </span>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>{solution.createdAt}</span>
          </span>
        </div>

        <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
          View details
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}
