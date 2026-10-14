'use client';

import React from 'react';
import { AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900/60 rounded-3xl shadow-lg text-center my-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        তথ্য লোড করা সম্ভব হয়নি
      </h3>

      <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
        {message ||
          'সরকারি বামিস (BAMIS) সার্ভার থেকে এই মুহূর্তে জেলা বুলেটিন সংগ্রহ করা যাচ্ছে না। সরকারি ওয়েবসাইট সাময়িকভাবে ডাউন থাকতে পারে।'}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          id="error-retry-btn"
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>পুনরায় চেষ্টা করুন</span>
        </button>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800 text-xs text-slate-400 dark:text-zinc-500 flex items-center justify-center gap-1.5">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>অন্য জেলা নির্বাচন করতে পারেন বা কিছুক্ষণ পর চেষ্টা করুন</span>
      </div>
    </div>
  );
}
