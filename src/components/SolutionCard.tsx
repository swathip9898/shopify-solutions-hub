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
  Crown,
} from 'lucide-react';

interface SolutionCardProps {
  solution: Solution;
  onSelect: (solution: Solution) => void;
  onFilterBrand?: (brandName: string) => void;
  onFilterAuthor?: (authorName: string) => void;
  authorRank?: number;
}

export function getCategoryBadgeColor(category: SolutionCategory): string {
  // Sophisticated monochrome palette with clear contrast
  switch (category) {
    case 'Theme / Liquid':
    case 'Checkout UI Extension':
    case 'Shopify Functions':
    case 'Custom App (Remix/Node)':
    case 'Shopify Flow & Webhook':
    case 'Metafields & Custom Data':
    case '3rd-Party Integration':
    case 'Performance & CRO':
    default:
      return 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
  }
}

export default function SolutionCard({
  solution,
  onSelect,
  onFilterBrand,
  onFilterAuthor,
  authorRank,
}: SolutionCardProps) {
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
      className="group relative bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm hover:shadow-lg hover:border-neutral-950 dark:hover:border-neutral-500 transition-all duration-200 flex flex-col justify-between cursor-pointer"
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-800"
            >
              <Store className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
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

          <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded border border-neutral-200/50 dark:border-neutral-800">
            {solution.id}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-neutral-950 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors line-clamp-2 leading-snug mb-2">
          {solution.title}
        </h3>

        {/* Problem summary */}
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
          {solution.problem}
        </p>

        {/* Code Snippet Preview (if available) */}
        {solution.codeSnippet && (
          <div className="relative mb-4 rounded-xl bg-black border border-neutral-800 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900/90 border-b border-neutral-800 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Code className="w-3.5 h-3.5 text-neutral-400" />
                <span>Code Snippet</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                title="Copy snippet"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span className="text-white font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 font-mono text-neutral-300 overflow-x-hidden text-[11px] max-h-24 opacity-80 group-hover:opacity-100 transition-opacity">
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
                className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 font-mono border border-neutral-200 dark:border-neutral-800"
              >
                #{tag}
              </span>
            ))}
            {solution.tags.length > 3 && (
              <span className="text-[11px] text-neutral-400 self-center">
                +{solution.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Author & Action */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFilterAuthor?.(solution.authorName);
            }}
            className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors group/author"
            title={`Filter solutions by ${solution.authorName}`}
          >
            <User className="w-3.5 h-3.5 text-neutral-400 group-hover/author:text-neutral-900 dark:group-hover/author:text-white" />
            <span className="font-medium text-neutral-800 dark:text-neutral-200 group-hover/author:underline">
              {solution.authorName}
            </span>
            {authorRank === 1 && (
              <span
                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-sm"
                title="#1 Top Contributor"
              >
                <Crown className="w-2.5 h-2.5" />
                <span>#1</span>
              </span>
            )}
            {authorRank === 2 && (
              <span
                className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                title="#2 Contributor"
              >
                🥈 #2
              </span>
            )}
            {authorRank === 3 && (
              <span
                className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700"
                title="#3 Contributor"
              >
                🥉 #3
              </span>
            )}
          </button>
          <span className="flex items-center gap-1 text-[11px] text-neutral-400">
            <Calendar className="w-3 h-3" />
            <span>{solution.createdAt}</span>
          </span>
        </div>

        <span className="flex items-center gap-0.5 text-neutral-950 dark:text-white font-semibold group-hover:translate-x-0.5 transition-transform">
          View details
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}
