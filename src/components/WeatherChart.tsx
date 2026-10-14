'use client';

import React, { useState } from 'react';
import { DayWeather } from '@/types/bulletin';
import { formatBengaliWeekdayDate, toBengaliNumber } from '@/lib/bamis/formatters';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

interface WeatherChartProps {
  forecast: DayWeather[];
  pastWeather: DayWeather[];
}

export function WeatherChart({ forecast, pastWeather }: WeatherChartProps) {
  const [activeTab, setActiveTab] = useState<'forecast' | 'past'>('forecast');

  const activeDays = activeTab === 'forecast' ? forecast : pastWeather;

  const chartData = activeDays.map((d) => {
    const { shortDate } = formatBengaliWeekdayDate(d.date);
    return {
      rawDate: d.date,
      displayDate: shortDate,
      maxTemp: d.maxTempC,
      minTemp: d.minTempC,
      rain: d.rainMm
    };
  });

  // Calculate min and max for Y-axis domain
  const allTemps = chartData.flatMap((d) => [d.maxTemp, d.minTemp]).filter((t) => t > 0);
  const minDomain = allTemps.length ? Math.floor(Math.min(...allTemps) - 2) : 15;
  const maxDomain = allTemps.length ? Math.ceil(Math.max(...allTemps) + 2) : 40;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>তাপমাত্রার গতিপ্রকৃতি চিত্র (গ্রাফ)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            দৈনিক সর্বোচ্চ ও সর্বনিম্ন তাপমাত্রার পরিবর্তন
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold">
          <button
            type="button"
            id="tab-forecast-btn"
            onClick={() => setActiveTab('forecast')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'forecast'
                ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            আগামী ৫ দিনের পূর্বাভাস
          </button>
          <button
            type="button"
            id="tab-past-btn"
            onClick={() => setActiveTab('past')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'past'
                ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            গত ৪ দিনের তথ্য
          </button>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMaxTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMinTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 12, fill: '#888888' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              domain={[minDomain, maxDomain]}
              tick={{ fontSize: 12, fill: '#888888' }}
              tickFormatter={(v) => `${toBengaliNumber(v)}°`}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-zinc-700 text-xs">
                      <p className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        {data.displayDate}
                      </p>
                      <div className="space-y-1">
                        <p className="text-rose-600 dark:text-rose-400 font-semibold flex items-center justify-between gap-4">
                          <span>সর্বোচ্চ তাপমাত্রা:</span>
                          <span>{toBengaliNumber(data.maxTemp)}° সে</span>
                        </p>
                        <p className="text-sky-600 dark:text-sky-400 font-semibold flex items-center justify-between gap-4">
                          <span>সর্বনিম্ন তাপমাত্রা:</span>
                          <span>{toBengaliNumber(data.minTemp)}° সে</span>
                        </p>
                        {data.rain > 0 && (
                          <p className="text-blue-600 dark:text-blue-400 font-medium pt-1 border-t border-slate-100 dark:border-zinc-700">
                            বৃষ্টিপাত: {toBengaliNumber(data.rain)} মি.মি.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              formatter={(value) => {
                if (value === 'maxTemp') return 'সর্বোচ্চ (°সে)';
                if (value === 'minTemp') return 'সর্বনিম্ন (°সে)';
                return value;
              }}
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />

            <Area
              type="monotone"
              dataKey="maxTemp"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorMaxTemp)"
            />
            <Area
              type="monotone"
              dataKey="minTemp"
              stroke="#0284c7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorMinTemp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
