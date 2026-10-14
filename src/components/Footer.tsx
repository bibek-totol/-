'use client';

import React from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { toBengaliNumber } from '@/lib/bamis/formatters';

interface FooterProps {
  sourceUrl?: string;
  fetchedAt?: string;
}

export function Footer({ sourceUrl, fetchedAt }: FooterProps) {
  const formattedTime = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    : '';

  return (
    <footer className="w-full mt-16 border-t border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xs py-8 text-xs text-slate-500 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Source and Attribution */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 font-medium text-slate-700 dark:text-zinc-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              তথ্য সংগৃহীত: বাংলাদেশ কৃষি আবহাওয়া তথ্য সেবা (BAMIS) ও কৃষি সম্প্রসারণ অধিদপ্তর (DAE)
            </span>
          </div>
          <p className="text-slate-400 dark:text-zinc-500">
            কৃষি আবহাওয়া পূর্বাভাস প্রস্তুত ও সরবরাহ করে বাংলাদেশ আবহাওয়া অধিদপ্তর (BMD)
          </p>
        </div>

        {/* Dynamic Status / Link */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {fetchedAt && (
            <span className="text-slate-400 dark:text-zinc-500">
              সর্বশেষ ডেটা রিফ্রেশ: {toBengaliNumber(formattedTime)}
            </span>
          )}

          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 underline underline-offset-4"
            >
              <span>মূল সরকারি বুলেটিন পৃষ্ঠা</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
