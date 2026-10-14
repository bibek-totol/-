'use client';

import React, { useEffect, useState } from 'react';
import { CloudSun, ExternalLink, Moon, Sun, Printer } from 'lucide-react';

interface HeaderProps {
  onPrint?: () => void;
}

export function Header({ onPrint }: HeaderProps) {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('krishi-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    if (activeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Update state asynchronously to avoid synchronous effect re-render warning
    const id = requestAnimationFrame(() => setIsDark(activeDark));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('krishi-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('krishi-theme', 'light');
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-emerald-100 dark:border-zinc-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Title and Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 dark:text-emerald-400">
                কৃষি আবহাওয়া
              </h1>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                বামিস বুলেটিন
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              জেলা কৃষি আবহাওয়া পরামর্শ সেবা বুলেটিন
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Official Source Link */}
          <a
            href="https://www.bamis.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="no-print inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-3 py-1.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60 transition-colors"
            title="বাংলাদেশ কৃষি আবহাওয়া তথ্য সেবা (BAMIS / DAE)"
          >
            <span className="hidden md:inline">উৎস:</span>
            <span>BAMIS / DAE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Print / Save as PDF Button */}
          <button
            id="print-bulletin-btn"
            type="button"
            onClick={handlePrint}
            className="no-print inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন"
            aria-label="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">প্রিন্ট / PDF</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={toggleDarkMode}
            className="no-print p-2 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={isDark ? 'লাইট মোডে পরিবর্তন করুন' : 'ডার্ক মোডে পরিবর্তন করুন'}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
