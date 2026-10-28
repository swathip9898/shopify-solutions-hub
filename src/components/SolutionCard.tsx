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
  // Sophisticated monochrome palette with clear contrast
  switch (category) {
    case 'Theme / Liquid':
      return 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
    case 'Checkout UI Extension':
      return 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
    case 'Shopify Functions':
      return 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
    case 'Custom App (Remix/Node)':
      return 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
    case 'Shopify Flow & Webhook':
      return 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
    case 'Metafields & Custom Data':
      return 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
    case '3rd-Party Integration':
      return 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
    case 'Performance & CRO':
      return 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
    default:
      return 'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700';
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
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" title="Author">
            <User className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              {solution.authorName}
            </span>
          </span>
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
