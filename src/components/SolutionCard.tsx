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
  switch (category) {
    case 'Theme / Liquid':
    case 'Checkout UI Extension':
    case 'Shopify Functions':
    case 'Custom App (Remix/Node)':
    case 'Shopify Flow & Webhook':
    case 'Metafields & Custom Data':
    case '3rd-Party Integration':
    case 'Performance & CRO':
    case 'QA & Automation':
    default:
      return 'bg-[#EAF5FF] text-[#25364A] border-[#E3EDF7]';
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
      className="group relative bg-[#FFFFFF] rounded-2xl border border-[#E3EDF7] p-5 shadow-sm hover:shadow-xl hover:border-[#318CE7] transition-all duration-200 flex flex-col justify-between cursor-pointer"
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EAF5FF] text-[#25364A] hover:bg-[#FFFFFF] transition-colors border border-[#E3EDF7]"
            >
              <Store className="w-3.5 h-3.5 text-[#318CE7]" />
              <span>{solution.brandName}</span>
            </button>

            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getCategoryBadgeColor(
                solution.category
              )}`}
            >
              {solution.category}
            </span>
          </div>

          <span className="text-[11px] font-mono text-[#25364A]/60 bg-[#EAF5FF] px-2 py-0.5 rounded border border-[#E3EDF7]">
            {solution.id}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#25364A] group-hover:text-[#318CE7] transition-colors line-clamp-2 leading-snug mb-2">
          {solution.title}
        </h3>

        {/* Problem summary */}
        <p className="text-sm text-[#25364A]/70 line-clamp-2 mb-4 leading-relaxed">
          {solution.problem}
        </p>

        {/* Code Snippet Preview (if available) */}
        {solution.codeSnippet && (
          <div className="relative mb-4 rounded-xl bg-[#25364A] border border-[#25364A] overflow-hidden text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#1b2838] border-b border-[#354c68] text-[11px] text-[#70B7FF]">
              <span className="flex items-center gap-1.5 font-mono">
                <Code className="w-3.5 h-3.5 text-[#318CE7]" />
                <span>Code Snippet</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
                title="Copy snippet"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#70B7FF]" />
                    <span className="text-[#70B7FF] font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 font-mono text-[#EAF5FF] overflow-x-hidden text-[11px] max-h-24 opacity-95 group-hover:opacity-100 transition-opacity">
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
                className="text-[11px] px-2 py-0.5 rounded-md bg-[#EAF5FF] text-[#25364A]/80 font-mono border border-[#E3EDF7]"
              >
                #{tag}
              </span>
            ))}
            {solution.tags.length > 3 && (
              <span className="text-[11px] text-[#25364A]/60 self-center">
                +{solution.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Author & Action */}
      <div className="pt-3 border-t border-[#E3EDF7] flex items-center justify-between text-xs text-[#25364A]/70">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFilterAuthor?.(solution.authorName);
            }}
            className="flex items-center gap-1.5 hover:text-[#25364A] transition-colors group/author"
            title={`Filter solutions by ${solution.authorName}`}
          >
            <User className="w-3.5 h-3.5 text-[#318CE7]" />
            <span className="font-semibold text-[#25364A] group-hover/author:text-[#318CE7] group-hover/author:underline">
              {solution.authorName}
            </span>
            {authorRank === 1 && (
              <span
                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#318CE7] text-white shadow-sm"
                title="#1 Top Contributor"
              >
                <Crown className="w-2.5 h-2.5" />
                <span>#1</span>
              </span>
            )}
            {authorRank === 2 && (
              <span
                className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#70B7FF] text-white"
                title="#2 Contributor"
              >
                🥈 #2
              </span>
            )}
            {authorRank === 3 && (
              <span
                className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EAF5FF] text-[#25364A] border border-[#E3EDF7]"
                title="#3 Contributor"
              >
                🥉 #3
              </span>
            )}
          </button>
          <span className="flex items-center gap-1 text-[11px] text-[#25364A]/50">
            <Calendar className="w-3 h-3" />
            <span>{solution.createdAt}</span>
          </span>
        </div>

        {/* Action Link (#318CE7) */}
        <span className="flex items-center gap-0.5 text-[#318CE7] font-bold group-hover:translate-x-0.5 transition-transform">
          View details
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}
