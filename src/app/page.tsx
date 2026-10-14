'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Bulletin } from '@/types/bulletin';
import { isValidDistrictId } from '@/data/districts';
import { Header } from '@/components/Header';
import { DistrictSelect } from '@/components/DistrictSelect';
import { SummaryCard } from '@/components/SummaryCard';
import { WeatherCards } from '@/components/WeatherCards';
import { WeatherChart } from '@/components/WeatherChart';
import { WeatherTable } from '@/components/WeatherTable';
import { AdviceSection } from '@/components/AdviceSection';
import { BulletinSkeleton } from '@/components/Skeleton';
import { ErrorState } from '@/components/ErrorState';
import { Footer } from '@/components/Footer';
import { Compass } from 'lucide-react';

const QUICK_DISTRICTS = [
  { id: 27, name: 'ঠাকুরগাঁও' },
  { id: 24, name: 'বরগুনা' },
  { id: 37, name: 'ঢাকা' },
  { id: 5, name: 'রাজশাহী' },
  { id: 3, name: 'বগুড়া' },
  { id: 31, name: 'রংপুর' },
  { id: 13, name: 'যশোর' }
];

function BulletinApp() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read district from URL query parameter if present
  const queryParam = searchParams.get('district');
  const validParamId =
    queryParam && isValidDistrictId(parseInt(queryParam, 10))
      ? parseInt(queryParam, 10)
      : null;

  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(() => {
    if (validParamId) return validParamId;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('krishi-last-district');
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (isValidDistrictId(parsed)) return parsed;
        }
      } catch {
        // Ignore storage exceptions
      }
    }
    return 27; // Default to Thakurgaon
  });

  const [bulletin, setBulletin] = useState<Bulletin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCounter, setRetryCounter] = useState<number>(0);

  // Sync if URL query param changed
  useEffect(() => {
    if (validParamId && validParamId !== selectedDistrictId) {
      const id = requestAnimationFrame(() => setSelectedDistrictId(validParamId));
      return () => cancelAnimationFrame(id);
    }
  }, [validParamId, selectedDistrictId]);

  // Fetch bulletin when selectedDistrictId or retryCounter changes
  useEffect(() => {
    let cancelled = false;
    const fetchController = new AbortController();

    const fetchBulletinData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await fetch(`/api/bulletin/${selectedDistrictId}`, {
          signal: fetchController.signal
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error || `সার্ভার ত্রুটি (HTTP ${res.status}): বুলেটিন লোড করা যায়নি।`
          );
        }

        const data: Bulletin = await res.json();
        if (!cancelled) {
          setBulletin(data);
          setIsLoading(false);
          try {
            localStorage.setItem('krishi-last-district', selectedDistrictId.toString());
          } catch {
            // Ignore
          }
        }
      } catch (err: unknown) {
        if (!cancelled && !fetchController.signal.aborted) {
          const message =
            err instanceof Error
              ? err.message
              : 'বুলেটিন তথ্য সংগ্রহ করতে ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।';
          setErrorMessage(message);
          setBulletin(null);
          setIsLoading(false);
        }
      }
    };

    fetchBulletinData();

    return () => {
      cancelled = true;
      fetchController.abort();
    };
  }, [selectedDistrictId, retryCounter]);

  // Handle user selecting a new district
  const handleSelectDistrict = (newId: number) => {
    if (newId === selectedDistrictId && bulletin) return;
    setSelectedDistrictId(newId);
    router.push(`/?district=${newId}`);
  };

  const handleRetry = () => {
    setRetryCounter((c) => c + 1);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* District Selector & Quick Switch Section */}
        <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xs">
          <div className="max-w-xl mx-auto space-y-4">
            <DistrictSelect
              selectedDistrictId={selectedDistrictId}
              onSelectDistrict={handleSelectDistrict}
              isLoading={isLoading}
            />

            {/* Quick District Pills */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>দ্রুত জেলা পরিবর্তন:</span>
              </p>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {QUICK_DISTRICTS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleSelectDistrict(d.id)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                      selectedDistrictId === d.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Area: Loading / Error / Bulletin */}
        {isLoading && <BulletinSkeleton />}

        {errorMessage && !isLoading && (
          <ErrorState message={errorMessage} onRetry={handleRetry} />
        )}

        {bulletin && !isLoading && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* 1. Summary Card */}
            <SummaryCard bulletin={bulletin} />

            {/* 2. 5-Day Weather Forecast Cards */}
            <WeatherCards forecast={bulletin.forecast} />

            {/* 3. Temperature Recharts Area Chart */}
            <WeatherChart forecast={bulletin.forecast} pastWeather={bulletin.pastWeather} />

            {/* 4. Detailed Data Tables (Scrollable) */}
            <WeatherTable pastWeather={bulletin.pastWeather} forecast={bulletin.forecast} />

            {/* 5. Crop and Livestock Advice Sections */}
            <AdviceSection advice={bulletin.advice} />
          </div>
        )}
      </main>

      <Footer sourceUrl={bulletin?.sourceUrl} fetchedAt={bulletin?.fetchedAt} />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 text-center text-slate-500 font-medium">
          লোড হচ্ছে...
        </div>
      }
    >
      <BulletinApp />
    </Suspense>
  );
}
