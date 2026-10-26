'use client';

import React, { useState } from 'react';
import {
  X,
  Database,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { SheetConfigStatus } from '@/types';

interface GoogleSheetGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: SheetConfigStatus | null;
}

export default function GoogleSheetGuideModal({
  isOpen,
  onClose,
  status,
}: GoogleSheetGuideModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleEnv = `GOOGLE_SHEET_ID=1xYz...YourSpreadsheetId...
GOOGLE_SERVICE_ACCOUNT_EMAIL=shopify-solutions-bot@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwgg...\\n-----END PRIVATE KEY-----\\n"`;

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
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Google Sheets Database Setup
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect your Google Spreadsheet for free live data storage
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300 text-sm">
          {/* Status banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              status?.isConfigured
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
            }`}
          >
            <div>
              <div className="font-bold text-sm">
                {status?.isConfigured ? '🟢 Live Connected to Google Sheets' : '🟡 Running in Local Demo Mode'}
              </div>
              <p className="text-xs mt-0.5 opacity-90">
                {status?.isConfigured
                  ? `Spreadsheet ID: ${status.sheetId?.slice(0, 8)}... (Service: ${status.serviceAccountEmail})`
                  : 'Currently showing realistic sample data. Follow the 4 steps below to connect your real Google Sheet!'}
              </p>
            </div>
          </div>

          {/* Step 1 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              Create a Blank Google Sheet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
              Open{' '}
              <a
                href="https://sheets.new"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 underline inline-flex items-center gap-1 font-semibold"
              >
                sheets.new <ExternalLink className="w-3 h-3" />
              </a>{' '}
              and name it (e.g. <em>Shopify Custom Solutions</em>). You do not need to create columns manually; the app will auto-create the <code>Brands</code> and <code>Solutions</code> tabs for you!
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
              Copy the <strong>Sheet ID</strong> from the URL:{' '}
              <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono">
                docs.google.com/spreadsheets/d/<strong>[SPREADSHEET_ID]</strong>/edit
              </code>
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                2
              </span>
              Create a Free Google Cloud Service Account
            </h4>
            <div className="text-xs text-slate-500 dark:text-slate-400 pl-8 space-y-1">
              <p>
                1. Go to{' '}
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 underline inline-flex items-center gap-1 font-semibold"
                >
                  Google Cloud Console <ExternalLink className="w-3 h-3" />
                </a>{' '}
                (100% Free).
              </p>
              <p>2. Enable the <strong>Google Sheets API</strong> in the API Library.</p>
              <p>
                3. Go to <strong>IAM & Admin &gt; Service Accounts</strong> &gt; Click <em>Create Service Account</em>.
              </p>
              <p>
                4. Under the <strong>Keys</strong> tab, click <em>Add Key &gt; Create new key (JSON)</em> and download the file.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                3
              </span>
              Share Your Google Sheet with the Service Account Email
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
              Copy the <code>client_email</code> (looks like <code>...@your-project.iam.gserviceaccount.com</code>) and click <strong>Share</strong> in your Google Sheet. Add this email with <strong>Editor</strong> permission so it can read and log solutions.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                  4
                </span>
                Add Environment Variables in Vercel or .env.local
              </h4>
              <button
                onClick={() => handleCopy(sampleEnv, 'env')}
                className="text-xs flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                {copiedKey === 'env' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Template</span>
                  </>
                )}
              </button>
            </div>

            <div className="pl-8">
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-emerald-300 overflow-x-auto">
                <pre>{sampleEnv}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
          >
            Got it, close guide
          </button>
        </div>
      </div>
    </div>
  );
}
