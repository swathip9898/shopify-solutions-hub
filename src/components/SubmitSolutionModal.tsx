'use client';

import React, { useState, useEffect } from 'react';
import { Brand, Solution, SolutionCategory, SolutionDifficulty } from '@/types';
import {
  X,
  PlusCircle,
  Code,
  Store,
  Tag,
  User,
  GitBranch,
  Video,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface SubmitSolutionModalProps {
  brands: Brand[];
  isOpen: boolean;
  onClose: () => void;
  onSolutionAdded: (newSolution: Solution) => void;
}

const CATEGORIES: SolutionCategory[] = [
  'Theme / Liquid',
  'Checkout UI Extension',
  'Shopify Functions',
  'Custom App (Remix/Node)',
  'Shopify Flow & Webhook',
  'Metafields & Custom Data',
  '3rd-Party Integration',
  'Performance & CRO',
];

const DIFFICULTIES: SolutionDifficulty[] = [
  'Quick (< 2 hrs)',
  'Medium (1-2 days)',
  'Complex (1+ week)',
];

export default function SubmitSolutionModal({
  brands,
  isOpen,
  onClose,
  onSolutionAdded,
}: SubmitSolutionModalProps) {
  const [brandName, setBrandName] = useState(brands[0]?.name || '');
  const [isCustomBrand, setIsCustomBrand] = useState(brands.length === 0);
  const [customBrandName, setCustomBrandName] = useState('');

  useEffect(() => {
    if (brands.length === 0) {
      setIsCustomBrand(true);
    } else if (!brandName && brands[0]?.name) {
      setBrandName(brands[0].name);
    }
  }, [brands, brandName]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SolutionCategory>('Theme / Liquid');
  const [themeUsed, setThemeUsed] = useState('Dawn (v14.0)');
  const [problem, setProblem] = useState('');
  const [implementation, setImplementation] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [documentationLink, setDocumentationLink] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [difficulty, setDifficulty] = useState<SolutionDifficulty>('Medium (1-2 days)');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const selectedBrand = isCustomBrand ? customBrandName.trim() : brandName.trim();
    if (!selectedBrand) {
      setError('Please select or specify a brand name.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a descriptive title for this solution.');
      return;
    }
    if (!problem.trim()) {
      setError('Please explain what problem this custom feature solved.');
      return;
    }
    if (!authorName.trim()) {
      setError('Please enter your name so other devs can reach out.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);

    setLoading(true);

    try {
      const res = await fetch('/api/solutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: selectedBrand,
          title: title.trim(),
          category,
          themeUsed: themeUsed.trim() || 'Dawn',
          problem: problem.trim(),
          implementation: implementation.trim(),
          codeSnippet: codeSnippet.trim(),
          repoLink: repoLink.trim(),
          documentationLink: documentationLink.trim(),
          tags,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          difficulty,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save solution.');
      }

      setSuccess(true);
      onSolutionAdded(data.data);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Log New Custom Solution
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help developers reuse custom Shopify features across our 60+ brands
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Solution successfully logged to database!</span>
            </div>
          )}

          {/* Row 1: Brand & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-emerald-500" />
                  Shopify Brand *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomBrand(!isCustomBrand)}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {isCustomBrand ? 'Select from list' : '+ Enter new brand'}
                </button>
              </div>

              {isCustomBrand ? (
                <input
                  type="text"
                  placeholder="e.g. Gymshark or Luxe Apparel"
                  value={customBrandName}
                  onChange={(e) => setCustomBrandName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              ) : (
                <select
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.theme})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Theme / Tech Stack
              </label>
              <input
                type="text"
                placeholder="e.g. Dawn (v14.0), Prestige, Hydrogen"
                value={themeUsed}
                onChange={(e) => setThemeUsed(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Solution Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Dynamic Tiered Free Gift Cart Progress Bar with Auto-Add"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Row 3: Category & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Solution Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SolutionCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Build Complexity
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as SolutionDifficulty)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Problem Statement */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              Client Problem & Context *
            </label>
            <textarea
              rows={3}
              placeholder="What requirement did the client have? Why couldn't native Shopify or simple settings solve it?"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
              required
            />
          </div>

          {/* Row 5: Implementation & Architecture */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              How It Was Implemented / Setup Guide
            </label>
            <textarea
              rows={3}
              placeholder="1. Which liquid files, metafields, or apps were touched? 2. How to replicate on another brand?"
              value={implementation}
              onChange={(e) => setImplementation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Row 6: Code Snippet */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-emerald-500" />
                Key Code Snippet / Liquid / JS
              </span>
              <span className="text-[11px] text-slate-400">Optional</span>
            </label>
            <textarea
              rows={5}
              placeholder="// Paste key JavaScript, Liquid snippet, or Checkout Extension code here..."
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Row 7: Git & Documentation URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                GitHub PR / Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/team/.../pull/123"
                value={repoLink}
                onChange={(e) => setRepoLink(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Video className="w-3.5 h-3.5 text-slate-500" />
                Loom Demo / Figma / Notion Doc
              </label>
              <input
                type="url"
                placeholder="https://loom.com/share/... or Notion URL"
                value={documentationLink}
                onChange={(e) => setDocumentationLink(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 8: Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-500" />
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. cart-drawer, free-gift, dawn-theme, aov-booster"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Row 9: Contributor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <User className="w-3.5 h-3.5 text-emerald-500" />
                Your Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Work Email
              </label>
              <input
                type="email"
                placeholder="alex@company.com"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Log Solution</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
