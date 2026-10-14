'use client';

import React from 'react';
import { Bulletin } from '@/types/bulletin';
import { formatBengaliDate, toBengaliNumber } from '@/lib/bamis/formatters';
import { FileText, Calendar, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SummaryCardProps {
  bulletin: Bulletin;
}

export function SummaryCard({ bulletin }: SummaryCardProps) {
  return (
    <div className="w-full bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-2xl shadow-xl p-5 sm:p-7 relative overflow-hidden border border-emerald-700/50">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/80 text-emerald-100 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              সরকারি কৃষি আবহাওয়া বুলেটিন
            </span>

            {/* Stale Cache Badge if applicable */}
            {bulletin.stale && (
              <span
                id="stale-cache-badge"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/90 text-zinc-950 shadow-xs"
                title="সরকারি পোর্টাল সাময়িকভাবে অনুপুস্থিত থাকায় পূর্বের সংরক্ষিত তথ্য দেখানো হচ্ছে"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                পূর্বের সংরক্ষিত তথ্য (Old Data)
              </span>
            )}
          </div>

          {bulletin.bulletinNo > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-xs text-white border border-white/20">
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
              <span>বুলেটিন নং: {toBengaliNumber(bulletin.bulletinNo)}</span>
            </div>
          )}
        </div>

        {/* District Headline */}
        <div className="mb-5">
          <p className="text-xs sm:text-sm text-emerald-200 uppercase tracking-wider font-semibold">
            জেলা কৃষি আবহাওয়া পরামর্শ সেবা
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
            {bulletin.districtNameBn}
          </h2>
        </div>

        {/* Date & Period Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-emerald-700/60">
          <div className="flex items-center gap-2.5 text-emerald-100">
            <Calendar className="w-4 h-4 text-emerald-300 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="text-emerald-300 font-medium">প্রকাশকাল: </span>
              <span className="font-semibold text-white">
                {formatBengaliDate(bulletin.bulletinDate) || 'অজ্ঞাত'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-emerald-100">
            <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="text-emerald-300 font-medium">বুলেটিনের মেয়াদ: </span>
              <span className="font-semibold text-white">
                {bulletin.periodFrom && bulletin.periodTo
                  ? `${formatBengaliDate(bulletin.periodFrom)} হতে ${formatBengaliDate(bulletin.periodTo)}`
                  : 'বর্তমান সপ্তাহ'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
