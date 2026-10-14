'use client';

import React from 'react';
import { DayWeather } from '@/types/bulletin';
import { formatBengaliWeekdayDate, toBengaliNumber } from '@/lib/bamis/formatters';
import {
  Sun,
  CloudSun,
  CloudRain,
  Cloud,
  Droplets,
  Wind,
  Compass,
  Thermometer
} from 'lucide-react';

interface WeatherCardsProps {
  forecast: DayWeather[];
}

function getWeatherIcon(rainMm: number, cloud: number | string) {
  if (rainMm > 2.0) {
    return <CloudRain className="w-8 h-8 text-blue-500 animate-pulse" />;
  }
  if (typeof cloud === 'string') {
    if (cloud.includes('পরিষ্কার')) {
      return <Sun className="w-8 h-8 text-amber-500" />;
    }
    return <CloudSun className="w-8 h-8 text-amber-500" />;
  }
  if (typeof cloud === 'number') {
    if (cloud <= 1) return <Sun className="w-8 h-8 text-amber-500" />;
    if (cloud <= 4) return <CloudSun className="w-8 h-8 text-amber-400" />;
    return <Cloud className="w-8 h-8 text-slate-400" />;
  }
  return <Sun className="w-8 h-8 text-amber-500" />;
}

export function WeatherCards({ forecast }: WeatherCardsProps) {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>আগামী ৫ দিনের আবহাওয়ার পূর্বাভাস</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            কৃষি কাজের পরিকল্পনা ও সতর্কতার জন্য দৈনিক পূর্বাভাস
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {forecast.map((day, idx) => {
          const { weekday, shortDate } = formatBengaliWeekdayDate(day.date);
          const isToday = idx === 0;

          return (
            <div
              key={day.date}
              className={`rounded-2xl p-4 transition-all duration-200 border flex flex-col justify-between ${
                isToday
                  ? 'bg-gradient-to-b from-emerald-50/90 to-white dark:from-emerald-950/40 dark:to-zinc-900 border-emerald-300 dark:border-emerald-700 shadow-md ring-1 ring-emerald-400/20'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-xs hover:border-emerald-200 dark:hover:border-emerald-800'
              }`}
            >
              {/* Header: Weekday & Date */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="font-bold text-base text-slate-900 dark:text-white">
                    {weekday}
                  </span>
                  {isToday ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                      আজ
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                      {shortDate}
                    </span>
                  )}
                </div>

                {/* Weather Icon and Description */}
                <div className="flex items-center gap-3 my-3">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/80 shrink-0">
                    {getWeatherIcon(day.rainMm, day.cloud)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                      {day.rainMm > 0
                        ? 'বৃষ্টির সম্ভাবনা'
                        : typeof day.cloud === 'string'
                        ? day.cloud
                        : day.cloud > 4
                        ? 'মেঘলা আকাশ'
                        : 'পরিষ্কার আকাশ'}
                    </div>
                    {day.rainMm > 0 && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                        {toBengaliNumber(day.rainMm)} মি.মি.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Weather Metrics */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
                {/* Temperatures */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-zinc-400">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    <span>তাপমাত্রা:</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-zinc-100">
                    <span className="text-rose-600 dark:text-rose-400">
                      {toBengaliNumber(day.maxTempC)}°
                    </span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {toBengaliNumber(day.minTempC)}° সে
                    </span>
                  </div>
                </div>

                {/* Humidity */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-zinc-400">
                    <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                    <span>আর্দ্রতা:</span>
                  </div>
                  <div className="font-semibold text-slate-700 dark:text-zinc-300">
                    {toBengaliNumber(day.humidity.min)}%-{toBengaliNumber(day.humidity.max)}%
                  </div>
                </div>

                {/* Wind */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-zinc-400">
                    <Wind className="w-3.5 h-3.5 text-emerald-500" />
                    <span>বাতাস:</span>
                  </div>
                  <div className="font-semibold text-slate-700 dark:text-zinc-300">
                    {typeof day.windSpeedKmh === 'number'
                      ? `${toBengaliNumber(day.windSpeedKmh)} কিমি/ঘ`
                      : `${toBengaliNumber(day.windSpeedKmh.min)}-${toBengaliNumber(
                          day.windSpeedKmh.max
                        )} কিমি/ঘ`}
                  </div>
                </div>

                {/* Wind direction */}
                {day.windDirection && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400 truncate pt-0.5">
                    <Compass className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{day.windDirection}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
