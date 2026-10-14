import * as cheerio from 'cheerio';
import { DISTRICTS, District } from '../src/data/districts';

interface VerificationResult {
  id: number;
  expectedBn: string;
  expectedEn: string;
  actualBn?: string;
  actualEn?: string;
  status: 'MATCH' | 'MISMATCH' | 'NOT_FOUND' | 'ERROR';
  error?: string;
}

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchWithRetry(url: string, retries = 2): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: controller.signal
      });
      clearTimeout(timer);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.text();
    } catch (err: any) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error('Failed to fetch after retries');
}

async function verifyDistrict(district: { id: number; bengali?: string; english?: string }): Promise<VerificationResult> {
  const url = `https://www.bamis.gov.bd/bulletin/district/current/${district.id}`;
  try {
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    // Check if bulletin exists (.WordSection1 or #AiContent)
    const wordSection = $('.WordSection1');
    if (wordSection.length === 0) {
      return {
        id: district.id,
        expectedBn: district.bengali || '',
        expectedEn: district.english || '',
        status: 'NOT_FOUND'
      };
    }

    // Extract district name from the first paragraph in .WordSection1:
    // e.g. "আবহাওয়া ভিত্তিক কৃষি বিষয়ক বুলেটিন জেলা: ঠাকুরগাঁও"
    let actualBn = '';
    const pFirst = wordSection.find('p').first().text().trim();
    let match = pFirst.match(/জেলা[:\s]+([\u0980-\u09FF\s]+?)(?:$|\s|[\.,])/);
    if (!match) {
      match = wordSection.text().match(/জেলা[:\s]+([\u0980-\u09FF]+)/);
    }
    if (match) {
      actualBn = match[1].trim();
    }

    if (!actualBn) {
      return {
        id: district.id,
        expectedBn: district.bengali || '',
        expectedEn: district.english || '',
        status: 'NOT_FOUND'
      };
    }

    // Normalize unicode forms for Bengali
    const normBnExpected = (district.bengali || '').normalize('NFC').replace(/[\s\u200B-\u200D]/g, '');
    const normBnActual = actualBn.normalize('NFC').replace(/[\s\u200B-\u200D]/g, '');

    const isMatch = normBnActual === normBnExpected || normBnActual.includes(normBnExpected) || normBnExpected.includes(normBnActual);

    return {
      id: district.id,
      expectedBn: district.bengali || '',
      expectedEn: district.english || '',
      actualBn,
      status: isMatch ? 'MATCH' : 'MISMATCH'
    };
  } catch (err: any) {
    return {
      id: district.id,
      expectedBn: district.bengali || '',
      expectedEn: district.english || '',
      status: 'ERROR',
      error: err.message
    };
  }
}

async function run() {
  console.log('====================================================');
  console.log('VERIFYING DISTRICT IDS AGAINST LIVE BAMIS PORTAL');
  console.log('====================================================\n');

  // Test all 64 districts plus IDs 11 and 17
  const testList = [
    ...DISTRICTS,
    { id: 11, bengali: 'ID 11', english: 'ID 11 check' },
    { id: 17, bengali: 'ID 17', english: 'ID 17 check' }
  ];

  const results: VerificationResult[] = [];
  const concurrency = 2;
  const delayMs = 500;

  for (let i = 0; i < testList.length; i += concurrency) {
    const chunk = testList.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk.map(d => verifyDistrict(d)));
    results.push(...chunkResults);
    for (const res of chunkResults) {
      if (res.status === 'MATCH') {
        console.log(`[PASS] ID ${res.id.toString().padStart(2, ' ')}: ${res.expectedEn} (${res.expectedBn}) -> Live: ${res.actualBn}`);
      } else if (res.status === 'MISMATCH') {
        console.log(`[MISMATCH] ID ${res.id}: Expected '${res.expectedBn}', Live: '${res.actualBn}'`);
      } else if (res.status === 'NOT_FOUND') {
        console.log(`[NOT FOUND] ID ${res.id}: Not on live site (${res.expectedEn})`);
      } else {
        console.log(`[ERROR] ID ${res.id}: ${res.error}`);
      }
    }
    if (i + concurrency < testList.length) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  console.log('\n====================================================');
  console.log('VERIFICATION SUMMARY REPORT');
  console.log('====================================================');
  const validDistricts = results.filter(r => r.id !== 11 && r.id !== 17);
  const matches = validDistricts.filter(r => r.status === 'MATCH');
  const mismatches = validDistricts.filter(r => r.status === 'MISMATCH');
  const missing = results.filter(r => r.status === 'NOT_FOUND');
  console.log(`Total valid districts checked: ${validDistricts.length}`);
  console.log(`Matches: ${matches.length}/${validDistricts.length}`);
  console.log(`Mismatches: ${mismatches.length}`);
  console.log(`Missing/Invalid IDs: ${missing.map(m => `ID ${m.id} (${m.expectedEn})`).join(', ')}`);

  if (mismatches.length > 0) {
    console.log('\nDetails of Mismatches:');
    mismatches.forEach(m => {
      console.log(`  ID ${m.id} (${m.expectedEn}): Expected "${m.expectedBn}" -> Found "${m.actualBn}"`);
    });
  }

  const r11 = results.find(r => r.id === 11);
  const r17 = results.find(r => r.id === 17);
  console.log(`\nSpecial Check:`);
  console.log(`  ID 11: ${r11?.status}`);
  console.log(`  ID 17: ${r17?.status}`);
}

run().catch(console.error);
