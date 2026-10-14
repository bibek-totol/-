'use client';

import React, { useState } from 'react';
import { AdviceSection as IAdviceSection } from '@/types/bulletin';
import {
  ChevronDown,
  Sprout,
  Fish,
  Bird,
  ShieldAlert,
  Sparkles,
  Wheat,
  Apple
} from 'lucide-react';

interface AdviceSectionProps {
  advice: IAdviceSection[];
}

function getSectionIcon(title: string) {
  if (title.includes('ধান') || title.includes('গম') || title.includes('শস্য')) {
    return <Wheat className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
  }
  if (title.includes('মৎস্য') || title.includes('মাছ')) {
    return <Fish className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
  }
  if (title.includes('হাঁস') || title.includes('মুরগী') || title.includes('পাখি')) {
    return <Bird className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
  }
  if (title.includes('গবাদি') || title.includes('পশু') || title.includes('গরু')) {
    return <ShieldAlert className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
  }
  if (title.includes('উদ্যান') || title.includes('ফল')) {
    return <Apple className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
  }
  return <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
}

export function AdviceSection({ advice }: AdviceSectionProps) {
  // First accordion open by default
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    0: true
  });

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const expandAll = () => {
    const allOpen = advice.reduce((acc, _, i) => ({ ...acc, [i]: true }), {});
    setOpenSections(allOpen);
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  if (!advice || advice.length === 0) {
    return (
      <div className="w-full p-6 text-center bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 text-slate-500">
        এই জেলার জন্য কোনো বিশেষ কৃষি পরামর্শ পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>ফসল ও কৃষিভিত্তিক পরামর্শ সেবা</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            আবহাওয়ার প্রভাব বিবেচনায় কৃষি সম্প্রসারণ অধিদপ্তরের (DAE) নির্দেশিকা
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={expandAll}
            className="text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            সব খুলুন
          </button>
          <span className="text-slate-300 dark:text-zinc-700">|</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-slate-500 dark:text-zinc-400 hover:underline cursor-pointer"
          >
            সব বন্ধ করুন
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {advice.map((sec, idx) => {
          const isOpen = !!openSections[idx];
          return (
            <div
              key={`${sec.title}-${idx}`}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs transition-all"
            >
              {/* Accordion Trigger */}
              <button
                type="button"
                id={`advice-accordion-btn-${idx}`}
                aria-expanded={isOpen}
                onClick={() => toggleSection(idx)}
                className="w-full p-4 sm:p-4.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    {getSectionIcon(sec.title)}
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                      {sec.title}
                    </h4>
                    {sec.stage && (
                      <span className="inline-block mt-0.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                        পর্যায়: {sec.stage}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400 dark:text-zinc-500 hidden sm:inline">
                    {sec.items.length}টি পরামর্শ
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-zinc-800 text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-4 pb-4 sm:px-6 sm:pb-5 pt-1 border-t border-slate-100 dark:border-zinc-800/80 bg-slate-50/30 dark:bg-zinc-900/40">
                  <ul className="space-y-2.5 mt-2.5">
                    {sec.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-zinc-200 leading-relaxed"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                        <span className="select-text">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
