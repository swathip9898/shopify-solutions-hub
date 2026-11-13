'use client';

import React, { useState, useEffect } from 'react';
import { Solution } from '@/types';
import {
  X,
  Code,
  Copy,
  Check,
  ExternalLink,
  Store,
  Calendar,
  User,
  GitBranch,
  Video,
  FileText,
  Tag,
  Clock,
  Sparkles,
  Crown,
} from 'lucide-react';
import { getCategoryBadgeColor } from './SolutionCard';

interface SolutionDetailModalProps {
  solution: Solution | null;
  onClose: () => void;
  onFilterBrand?: (brandName: string) => void;
  onFilterAuthor?: (authorName: string) => void;
  authorRank?: number;
  authorBadge?: string;
}

export default function SolutionDetailModal({
  solution,
  onClose,
  onFilterBrand,
  onFilterAuthor,
  authorRank,
  authorBadge,
}: SolutionDetailModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!solution) return null;

  const handleCopyCode = () => {
    if (solution.codeSnippet) {
      navigator.clipboard.writeText(solution.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#25364A]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#FFFFFF] border border-[#E3EDF7] rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E3EDF7] flex items-start justify-between gap-4 bg-[#EAF5FF]">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#25364A]/60 bg-[#FFFFFF] px-2.5 py-1 rounded-md border border-[#E3EDF7]">
                {solution.id}
              </span>

              <button
                onClick={() => {
                  onFilterBrand?.(solution.brandName);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#FFFFFF] text-[#25364A] border border-[#E3EDF7] hover:bg-[#F8FBFF] transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-[#318CE7]" />
                <span>{solution.brandName}</span>
              </button>

              <span
                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${getCategoryBadgeColor(
                  solution.category
                )}`}
              >
                {solution.category}
              </span>

              <span className="inline-flex items-center gap-1 text-xs text-[#25364A]/80 bg-[#FFFFFF] px-2.5 py-1 rounded-md border border-[#E3EDF7]">
                Theme: <strong className="text-[#25364A]">{solution.themeUsed}</strong>
              </span>

              {solution.difficulty && (
                <span className="inline-flex items-center gap-1 text-xs text-[#25364A] bg-[#FFFFFF] px-2.5 py-1 rounded-md border border-[#E3EDF7]">
                  <Clock className="w-3 h-3 text-[#318CE7]" />
                  {solution.difficulty}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#25364A] leading-tight">
              {solution.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#25364A]/50 hover:text-[#25364A] bg-[#FFFFFF] hover:bg-[#F8FBFF] rounded-full transition-colors shrink-0 border border-[#E3EDF7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#25364A]">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-[#EAF5FF] border border-[#E3EDF7] text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#318CE7]" />
              <div>
                <div className="text-[#25364A]/60 font-medium">Created by</div>
                <div className="font-bold text-[#25364A] flex items-center gap-2 flex-wrap">
                  <span>
                    {solution.authorName} {solution.authorEmail ? `(${solution.authorEmail})` : ''}
                  </span>
                  {authorRank === 1 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#318CE7] text-white shadow-sm">
                      <Crown className="w-2.5 h-2.5" />
                      <span>#1 Top Contributor</span>
                    </span>
                  )}
                  {authorRank === 2 && (
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#70B7FF] text-white">
                      🥈 #2 Contributor
                    </span>
                  )}
                  {authorRank === 3 && (
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#25364A] border border-[#E3EDF7]">
                      🥉 #3 Contributor
                    </span>
                  )}
                  {authorBadge && authorRank && authorRank > 3 && (
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#25364A] border border-[#E3EDF7]">
                      {authorBadge}
                    </span>
                  )}
                  {onFilterAuthor && (
                    <button
                      type="button"
                      onClick={() => {
                        onFilterAuthor(solution.authorName);
                        onClose();
                      }}
                      className="text-[11px] text-[#318CE7] font-bold hover:underline ml-1"
                    >
                      Filter solutions
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#318CE7]" />
              <div>
                <div className="text-[#25364A]/60 font-medium">Logged on</div>
                <div className="font-bold text-[#25364A]">
                  {solution.createdAt}
                </div>
              </div>
            </div>

            {/* External Links */}
            {(solution.repoLink || solution.documentationLink) && (
              <div className="flex items-center gap-3 ml-auto flex-wrap">
                {solution.repoLink && (
                  <a
                    href={solution.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25364A] text-white rounded-lg font-bold hover:bg-[#1b2838] transition-colors shadow-sm text-xs"
                  >
                    <GitBranch className="w-3.5 h-3.5 text-[#70B7FF]" />
                    <span>View Git PR / Repo</span>
                    <ExternalLink className="w-3 h-3 text-[#70B7FF]" />
                  </a>
                )}

                {/* Secondary Button: #70B7FF */}
                {solution.documentationLink && (
                  <a
                    href={solution.documentationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#70B7FF] text-white rounded-lg font-bold hover:bg-[#5aa9f7] transition-colors shadow-sm text-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Loom / Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Problem Statement */}
          <section className="space-y-2">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#25364A] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#318CE7]" />
              Problem & Requirement
            </h4>
            <div className="p-4 rounded-xl bg-[#EAF5FF] border border-[#E3EDF7] text-sm leading-relaxed whitespace-pre-line text-[#25364A]">
              {solution.problem}
            </div>
          </section>

          {/* Implementation & Architecture */}
          <section className="space-y-2">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#25364A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#318CE7]" />
              How It Was Implemented
            </h4>
            <div className="p-4 rounded-xl bg-[#EAF5FF] border border-[#E3EDF7] text-sm leading-relaxed whitespace-pre-line text-[#25364A]">
              {solution.implementation}
            </div>
          </section>

          {/* Code Snippet */}
          {solution.codeSnippet && (
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-wider text-[#25364A] flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#318CE7]" />
                  Code Snippet / Configuration
                </h4>
                {/* Primary Button (#318CE7 / Hover #2478CC) */}
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#318CE7] text-white hover:bg-[#2478CC] transition-colors shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-2xl bg-[#25364A] border border-[#25364A] overflow-hidden shadow-inner">
                <div className="px-4 py-2 bg-[#1b2838] border-b border-[#354c68] text-xs text-[#70B7FF] font-mono flex items-center justify-between">
                  <span>Liquid / JavaScript / React</span>
                  <span>{solution.codeSnippet.split('\n').length} lines</span>
                </div>
                <pre className="p-4 font-mono text-xs text-[#EAF5FF] overflow-x-auto max-h-96 leading-relaxed">
                  <code>{solution.codeSnippet}</code>
                </pre>
              </div>
            </section>
          )}

          {/* Tags */}
          {solution.tags && solution.tags.length > 0 && (
            <section className="space-y-2 pt-2 border-t border-[#E3EDF7]">
              <div className="text-xs font-bold text-[#25364A]/60 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#318CE7]" />
                <span>Search Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {solution.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1 rounded-lg bg-[#EAF5FF] text-[#25364A] border border-[#E3EDF7]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E3EDF7] flex justify-end gap-3 bg-[#EAF5FF]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-[#FFFFFF] text-[#25364A] hover:bg-[#F8FBFF] border border-[#E3EDF7] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
