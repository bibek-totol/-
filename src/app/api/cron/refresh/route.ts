import { NextRequest, NextResponse } from 'next/server';
import { DISTRICTS } from '@/data/districts';
import { getDistrictBulletin } from '@/lib/bamis/fetchBulletin';

export const maxDuration = 300; // Allow 5 minutes on Vercel Pro/server environments

export async function POST(request: NextRequest) {
  // Check authorization
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'অননুমোদিত অনুরোধ (Unauthorized)' }, { status: 401 });
  }

  const results: { id: number; name: string; status: string; error?: string }[] = [];
  const concurrency = 2;
  const delayMs = 500;

  for (let i = 0; i < DISTRICTS.length; i += concurrency) {
    const chunk = DISTRICTS.slice(i, i + concurrency);
    const chunkPromises = chunk.map(async (district) => {
      try {
        await getDistrictBulletin(district.id);
        return {
          id: district.id,
          name: district.english,
          status: 'SUCCESS'
        };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return {
          id: district.id,
          name: district.english,
          status: 'FAILED',
          error: errorMessage
        };
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);

    if (i + concurrency < DISTRICTS.length) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  const successes = results.filter((r) => r.status === 'SUCCESS').length;
  const failures = results.filter((r) => r.status === 'FAILED').length;

  return NextResponse.json({
    message: 'Bulletin refresh completed',
    total: results.length,
    successes,
    failures,
    results
  });
}
