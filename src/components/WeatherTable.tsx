'use client';

import React, { useState } from 'react';
import { DayWeather } from '@/types/bulletin';
import { formatBengaliWeekdayDate, toBengaliNumber } from '@/lib/bamis/formatters';
import { Table, CloudRain, Thermometer, Droplets, Wind, Compass, Cloud } from 'lucide-react';

interface WeatherTableProps {
  pastWeather: DayWeather[];
  forecast: DayWeather[];
}

export function WeatherTable({ pastWeather, forecast }: WeatherTableProps) {
  const [selectedView, setSelectedView] = useState<'forecast' | 'past'>('forecast');

  const days = selectedView === 'forecast' ? forecast : pastWeather;
  const title =
    selectedView === 'forecast'
      ? 'আগামী ৫ দিনের আবহাওয়ার পূর্বাভাস সারণী'
      : 'গত ৪ দিনের আবহাওয়া পরিস্থিতি সারণী';

  if (!days || days.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
      {/* Table Header & Toggle */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            বিস্তৃত পরিসংখ্যান (মোবাইলে স্ক্রল করুন)
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedView('forecast')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedView === 'forecast'
                ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            পূর্বাভাস (৫ দিন)
          </button>
          <button
            type="button"
            onClick={() => setSelectedView('past')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedView === 'past'
                ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            অতীত পরিস্থিতি (৪ দিন)
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Table */}
      <div className="overflow-x-auto horizontal-scroll">
        <table className="w-full min-w-[620px] text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-200 dark:border-zinc-800">
              <th className="py-3.5 px-4 font-bold text-slate-900 dark:text-white sticky left-0 bg-slate-50 dark:bg-zinc-800/90 backdrop-blur-xs z-10 w-44">
                স্থিতিমাপ (প্যারামিটার)
              </th>
              {days.map((d) => {
                const { formattedDate } = formatBengaliWeekdayDate(d.date);
                return (
                  <th
                    key={d.date}
                    className="py-3.5 px-4 font-bold text-slate-800 dark:text-zinc-200 text-center whitespace-nowrap"
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-xs text-emerald-700 dark:text-emerald-400">
                        {formattedDate.split(',')[0]}
                      </span>
                      <span>{formattedDate.split(',')[1]}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {/* Rain */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-zinc-300 sticky left-0 bg-white dark:bg-zinc-900 z-10 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span>বৃষ্টিপাত (মি.মি)</span>
              </td>
              {days.map((d) => (
                <td
                  key={d.date}
                  className={`py-3 px-4 text-center font-semibold ${
                    d.rainMm > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {toBengaliNumber(d.rainMm)}
                </td>
              ))}
            </tr>

            {/* Max Temp */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-zinc-300 sticky left-0 bg-white dark:bg-zinc-900 z-10 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-500" />
                <span>সর্বোচ্চ তাপমাত্রা (°সে)</span>
              </td>
              {days.map((d) => (
                <td key={d.date} className="py-3 px-4 text-center font-bold text-rose-600 dark:text-rose-400">
                  {toBengaliNumber(d.maxTempC)}°
                </td>
              ))}
            </tr>

            {/* Min Temp */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-zinc-300 sticky left-0 bg-white dark:bg-zinc-900 z-10 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-sky-500" />
                <span>সর্বনিম্ন তাপমাত্রা (°সে)</span>
              </td>
              {days.map((d) => (
                <td key={d.date} className="py-3 px-4 text-center font-bold text-sky-600 dark:text-sky-400">
                  {toBengaliNumber(d.minTempC)}°
                </td>
              ))}
            </tr>

            {/* Humidity */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-zinc-300 sticky left-0 bg-white dark:bg-zinc-900 z-10 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-500" />
                <span>আপেক্ষিক আর্দ্রতা (%)</span>
              </td>
              {days.map((d) => (
                <td key={d.date} className="py-3 px-4 text-center text-slate-700 dark:text-zinc-300">
                  {toBengaliNumber(d.humidity.min)} - {toBengaliNumber(d.humidity.max)}
                </td>
              ))}
            </tr>

            {/* Wind Speed */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-zinc-300 sticky left-0 bg-white dark:bg-zinc-900 z-10 flex items-center gap-2">
                <Wind className="w-4 h-4 text-emerald-500" />
                <span>বাতাসের গতিবেগ (কিমি/ঘ)</span>
              </td>
              {days.map((d) => (
                <td key={d.date} className="py-3 px-4 text-center text-slate-700 dark:text-zinc-300">
                  {typeof d.windSpeedKmh === 'number'
                    ? toBengaliNumber(d.windSpeedKmh)
                    : `${toBengaliNumber(d.windSpeedKmh.min)}-${toBengaliNumber(d.windSpeedKmh.max)}`}
                </td>
              ))}
            </tr>

            {/* Wind Direction */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-zinc-300 sticky left-0 bg-white dark:bg-zinc-900 z-10 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>বাতাসের দিক</span>
              </td>
              {days.map((d) => (
                <td key={d.date} className="py-3 px-4 text-center text-slate-600 dark:text-zinc-400 text-xs">
                  {d.windDirection || '—'}
                </td>
              ))}
            </tr>

            {/* Cloud */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-zinc-300 sticky left-0 bg-white dark:bg-zinc-900 z-10 flex items-center gap-2">
                <Cloud className="w-4 h-4 text-slate-400" />
                <span>মেঘের পরিমাণ (অক্টা)</span>
              </td>
              {days.map((d) => (
                <td key={d.date} className="py-3 px-4 text-center text-slate-700 dark:text-zinc-300 text-xs font-semibold">
                  {typeof d.cloud === 'number' ? `${toBengaliNumber(d.cloud)} অক্টা` : d.cloud}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
