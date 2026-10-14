'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { DISTRICTS, District } from '@/data/districts';
import { Search, MapPin, ChevronDown, Check, X } from 'lucide-react';

interface DistrictSelectProps {
  selectedDistrictId: number | null;
  onSelectDistrict: (districtId: number) => void;
  isLoading?: boolean;
}

export function DistrictSelect({
  selectedDistrictId,
  onSelectDistrict,
  isLoading = false
}: DistrictSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Alphabetically sorted districts by Bengali name
  const sortedDistricts = useMemo(() => {
    return [...DISTRICTS].sort((a, b) => a.bengali.localeCompare(b.bengali, 'bn'));
  }, []);

  // Filtered districts based on query (Bengali or English)
  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return sortedDistricts;
    const q = searchQuery.toLowerCase().trim();
    return sortedDistricts.filter(
      (d) =>
        d.bengali.toLowerCase().includes(q) ||
        d.english.toLowerCase().includes(q) ||
        d.id.toString() === q
    );
  }, [searchQuery, sortedDistricts]);

  const selectedDistrict = useMemo(() => {
    if (!selectedDistrictId) return null;
    return DISTRICTS.find((d) => d.id === selectedDistrictId) || null;
  }, [selectedDistrictId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (district: District) => {
    onSelectDistrict(district.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-xl mx-auto" ref={dropdownRef}>
      <label
        htmlFor="district-select-btn"
        className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2"
      >
        আপনার জেলা নির্বাচন করুন:
      </label>

      <div className="relative">
        {/* Dropdown Toggle Button */}
        <button
          id="district-select-btn"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={isLoading}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full min-h-[50px] px-4 py-3 bg-white dark:bg-zinc-900 border text-left rounded-xl shadow-xs flex items-center justify-between gap-3 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            isOpen
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-300 dark:border-zinc-700 hover:border-emerald-400 dark:hover:border-emerald-600'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="truncate">
              {selectedDistrict ? (
                <div className="flex items-baseline gap-2 truncate">
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {selectedDistrict.bengali}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
                    ({selectedDistrict.english})
                  </span>
                </div>
              ) : (
                <span className="text-base text-slate-400 dark:text-zinc-500">
                  জেলা নির্বাচন করুন
                </span>
              )}
            </div>
          </div>

          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180 text-emerald-600' : ''
            }`}
          />
        </button>

        {/* Combobox Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {/* Search Input Box */}
            <div className="p-2.5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  id="district-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="জেলার নাম খুঁজুন (বাংলা বা ইংরেজি)..."
                  className="w-full pl-9 pr-8 py-2.5 text-sm bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* District List with Large Touch Targets */}
            <ul
              role="listbox"
              id="district-options-list"
              className="max-h-64 overflow-y-auto p-1.5 divide-y divide-slate-50 dark:divide-zinc-800/50 focus:outline-none"
            >
              {filteredDistricts.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-slate-500 dark:text-zinc-400">
                  কোনো জেলা পাওয়া যায়নি (&quot;{searchQuery}&quot;)
                </li>
              ) : (
                filteredDistricts.map((district) => {
                  const isSelected = district.id === selectedDistrictId;
                  return (
                    <li
                      key={district.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(district)}
                      className={`px-3.5 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{district.bengali}</span>
                        <span className="text-xs text-slate-400 dark:text-zinc-500">
                          ({district.english})
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
