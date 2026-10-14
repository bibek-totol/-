'use client';

import React from 'react';

export function BulletinSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Summary Card Skeleton */}
      <div className="w-full h-44 rounded-2xl bg-emerald-900/20 dark:bg-zinc-800/60 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="w-32 h-6 bg-emerald-800/30 dark:bg-zinc-700/60 rounded-full" />
          <div className="w-24 h-6 bg-emerald-800/30 dark:bg-zinc-700/60 rounded-full" />
        </div>
        <div>
          <div className="w-48 h-10 bg-emerald-800/40 dark:bg-zinc-700/80 rounded-xl mb-2" />
          <div className="w-32 h-4 bg-emerald-800/30 dark:bg-zinc-700/50 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-emerald-800/20">
          <div className="w-36 h-4 bg-emerald-800/30 dark:bg-zinc-700/50 rounded-md" />
          <div className="w-44 h-4 bg-emerald-800/30 dark:bg-zinc-700/50 rounded-md" />
        </div>
      </div>

      {/* 5-day Weather Cards Skeleton */}
      <div>
        <div className="w-48 h-6 bg-slate-200 dark:bg-zinc-800 rounded-md mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-56 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 flex flex-col justify-between"
            >
              <div className="flex justify-between">
                <div className="w-16 h-5 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                <div className="w-10 h-4 bg-slate-200 dark:bg-zinc-800 rounded-md" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-zinc-800" />
                <div className="w-16 h-4 bg-slate-200 dark:bg-zinc-800 rounded-md" />
              </div>
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
                <div className="w-full h-4 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                <div className="w-3/4 h-4 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                <div className="w-2/3 h-4 bg-slate-200 dark:bg-zinc-800 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="w-full h-72 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="w-40 h-6 bg-slate-200 dark:bg-zinc-800 rounded-md" />
          <div className="w-48 h-8 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
        </div>
        <div className="w-full h-48 bg-slate-100 dark:bg-zinc-800/40 rounded-xl" />
      </div>

      {/* Advice Skeletons */}
      <div className="space-y-3">
        <div className="w-40 h-6 bg-slate-200 dark:bg-zinc-800 rounded-md" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-zinc-800" />
              <div className="w-28 h-5 bg-slate-200 dark:bg-zinc-800 rounded-md" />
            </div>
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
