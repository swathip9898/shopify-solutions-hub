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
} from 'lucide-react';
import { getCategoryBadgeColor } from './SolutionCard';

interface SolutionDetailModalProps {
  solution: Solution | null;
  onClose: () => void;
  onFilterBrand?: (brandName: string) => void;
}

export default function SolutionDetailModal({
  solution,
  onClose,
  onFilterBrand,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4 bg-neutral-50/70 dark:bg-neutral-900/50">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-neutral-500 bg-neutral-200/70 dark:bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-300/60 dark:border-neutral-800">
                {solution.id}
              </span>

              <button
                onClick={() => {
                  onFilterBrand?.(solution.brandName);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-neutral-500" />
                <span>{solution.brandName}</span>
              </button>

              <span
                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryBadgeColor(
                  solution.category
                )}`}
              >
                {solution.category}
              </span>

              <span className="inline-flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800">
                Theme: <strong className="text-neutral-900 dark:text-neutral-200">{solution.themeUsed}</strong>
              </span>

              {solution.difficulty && (
                <span className="inline-flex items-center gap-1 text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-300 dark:border-neutral-800">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  {solution.difficulty}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950 dark:text-white leading-tight">
              {solution.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-950 dark:hover:text-white bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors shrink-0 border border-neutral-200 dark:border-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-neutral-700 dark:text-neutral-300">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-500" />
              <div>
                <div className="text-neutral-400">Created by</div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-200">
                  {solution.authorName} {solution.authorEmail ? `(${solution.authorEmail})` : ''}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <div>
                <div className="text-neutral-400">Logged on</div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-200">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>View Git PR / Repo</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                )}

                {solution.documentationLink && (
                  <a
                    href={solution.documentationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Loom / Docs</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Problem Statement */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-neutral-500" />
              Problem & Requirement
            </h4>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 text-sm leading-relaxed whitespace-pre-line text-neutral-800 dark:text-neutral-200">
              {solution.problem}
            </div>
          </section>

          {/* Implementation & Architecture */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-500" />
              How It Was Implemented
            </h4>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 text-sm leading-relaxed whitespace-pre-line text-neutral-800 dark:text-neutral-200">
              {solution.implementation}
            </div>
          </section>

          {/* Code Snippet */}
          {solution.codeSnippet && (
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-neutral-500" />
                  Code Snippet / Configuration
                </h4>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
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

              <div className="relative rounded-2xl bg-black border border-neutral-800 overflow-hidden shadow-inner">
                <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs text-neutral-400 font-mono flex items-center justify-between">
                  <span>Liquid / JavaScript / React</span>
                  <span>{solution.codeSnippet.split('\n').length} lines</span>
                </div>
                <pre className="p-4 font-mono text-xs text-neutral-200 overflow-x-auto max-h-96 leading-relaxed">
                  <code>{solution.codeSnippet}</code>
                </pre>
              </div>
            </section>
          )}

          {/* Tags */}
          {solution.tags && solution.tags.length > 0 && (
            <section className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Search Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {solution.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3 bg-neutral-50/70 dark:bg-neutral-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
