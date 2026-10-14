import { Bulletin } from '@/types/bulletin';
import { parseBulletin } from './parseBulletin';
import { isValidDistrictId } from '@/data/districts';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// In-memory cache for fallback when live BAMIS fails
const fallbackCache = new Map<number, Bulletin>();

/**
 * Fetches HTML from BAMIS with a 10s timeout, custom User-Agent, and 2 retries.
 */
export async function fetchDistrictHTML(districtId: number, retries = 2): Promise<string> {
  const url = `https://www.bamis.gov.bd/bulletin/district/current/${districtId}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        signal: controller.signal,
        next: {
          revalidate: 10800 // 3 hours Next.js cache
        }
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`BAMIS returned HTTP ${res.status} for district ${districtId}`);
      }

      const html = await res.text();
      if (!html || html.length < 1000) {
        throw new Error(`BAMIS returned empty or truncated response for district ${districtId}`);
      }

      return html;
    } catch (err: unknown) {
      const isLastAttempt = attempt === retries;
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn(
        `[BAMIS FETCH] Attempt ${attempt + 1}/${retries + 1} failed for district ${districtId}: ${errorMessage}`
      );
      if (isLastAttempt) {
        throw err;
      }
      // Wait 1 second before retry
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  throw new Error(`Failed to fetch district ${districtId} after retries`);
}

/**
 * Fetches and parses the bulletin for a district.
 * If live fetching fails, falls back to the last known cached bulletin marked as stale.
 */
export async function getDistrictBulletin(districtId: number): Promise<Bulletin> {
  if (!isValidDistrictId(districtId)) {
    throw new Error(`Invalid district ID: ${districtId}`);
  }

  try {
    const html = await fetchDistrictHTML(districtId);
    const bulletin = parseBulletin(html, districtId);

    // Save to fallback cache
    fallbackCache.set(districtId, bulletin);
    return bulletin;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[BAMIS ERROR] Could not fetch live bulletin for district ${districtId}:`, errorMessage);

    // Check if we have a cached version to fall back to
    const cached = fallbackCache.get(districtId);
    if (cached) {
      console.warn(`[BAMIS FALLBACK] Returning stale cached bulletin for district ${districtId}`);
      return {
        ...cached,
        stale: true
      };
    }

    throw error;
  }
}
