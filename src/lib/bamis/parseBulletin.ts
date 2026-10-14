import * as cheerio from 'cheerio';
import { Bulletin, DayWeather, AdviceSection } from '@/types/bulletin';
import { DISTRICT_MAP } from '@/data/districts';
import {
  normalizeDateToISO,
  parseNormalizedNumber,
  parseRange,
  parseWindSpeed,
  parseCloud,
  normalizeDigits
} from './normalize';

/**
 * Parses a weather table (Past 4 days or Forecast 5 days).
 */
export function parseWeatherTable(
  $: cheerio.CheerioAPI,
  tableEl: Parameters<cheerio.CheerioAPI>[0]
): DayWeather[] {
  const rows = $(tableEl).find('tr');
  if (rows.length < 2) return [];

  // Extract header row cells
  const headerCells = $(rows[0])
    .find('td, th')
    .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
    .get();

  const dateColumns: { colIndex: number; date: string; rawDate: string }[] = [];
  for (let c = 1; c < headerCells.length; c++) {
    const text = headerCells[c];
    if (text.includes('সীমা')) continue; // Skip সীমা (range/limit) column
    const isoDate = normalizeDateToISO(text);
    if (isoDate) {
      dateColumns.push({ colIndex: c, date: isoDate, rawDate: text });
    }
  }

  if (dateColumns.length === 0) return [];

  const days: DayWeather[] = dateColumns.map((d) => ({
    date: d.date,
    rainMm: 0,
    maxTempC: 0,
    minTempC: 0,
    humidity: { min: 0, max: 0 },
    windSpeedKmh: 0,
    windDirection: '',
    cloud: 0
  }));

  // Iterate over data rows
  for (let r = 1; r < rows.length; r++) {
    const cells = $(rows[r])
      .find('td, th')
      .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
      .get();
    if (cells.length < 2) continue;
    const paramName = cells[0];

    days.forEach((day, idx) => {
      const colIdx = dateColumns[idx].colIndex;
      const cellVal = cells[colIdx] ?? '';

      if (paramName.includes('বৃষ্টি')) {
        day.rainMm = parseNormalizedNumber(cellVal);
      } else if (paramName.includes('সর্বোচ্চ')) {
        day.maxTempC = parseNormalizedNumber(cellVal);
      } else if (paramName.includes('সর্বনিম') || paramName.includes('সর্বনিম্ন')) {
        day.minTempC = parseNormalizedNumber(cellVal);
      } else if (paramName.includes('আর্দ্রতা')) {
        day.humidity = parseRange(cellVal);
      } else if (paramName.includes('গতিবেগ')) {
        day.windSpeedKmh = parseWindSpeed(cellVal);
      } else if (paramName.includes('দিক')) {
        day.windDirection = cellVal;
      } else if (paramName.includes('মেঘ')) {
        day.cloud = parseCloud(cellVal);
      }
    });
  }

  return days;
}

/**
 * Parses crop and livestock advice sections from #AiContent or subsequent DOM nodes.
 */
export function parseAdvice($: cheerio.CheerioAPI): AdviceSection[] {
  const sections: AdviceSection[] = [];
  const aiContent = $('#AiContent');

  if (aiContent.length > 0) {
    let currentTitle = '';
    let currentStage: string | undefined = undefined;
    let currentItems: string[] = [];

    aiContent.children().each((_, el) => {
      const tagName = el.tagName.toLowerCase();
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (!text) return;

      if (tagName === 'p' || tagName.startsWith('h')) {
        // When encountering a new heading, push the previous section
        if (currentTitle && (currentItems.length > 0 || currentStage)) {
          sections.push({
            title: currentTitle,
            stage: currentStage,
            items: currentItems
          });
        }
        currentTitle = text;
        currentStage = undefined;
        currentItems = [];
      } else if (tagName === 'ul' || tagName === 'ol') {
        $(el)
          .find('li')
          .each((_, li) => {
            const itemText = $(li).text().replace(/\s+/g, ' ').trim();
            if (!itemText) return;
            if (itemText.startsWith('পর্যায়:') || itemText.startsWith('পর্যায়:') || itemText.includes('পর্যায়:') || itemText.includes('পর্যায়:')) {
              currentStage = itemText.split(/:\s*/).slice(1).join(':').trim();
            } else {
              currentItems.push(itemText);
            }
          });
      }
    });

    if (currentTitle && (currentItems.length > 0 || currentStage)) {
      sections.push({
        title: currentTitle,
        stage: currentStage,
        items: currentItems
      });
    }
  }

  return sections;
}

/**
 * Parses full BAMIS bulletin HTML into structured Bulletin object.
 */
export function parseBulletin(html: string, districtId: number): Bulletin {
  const $ = cheerio.load(html);
  const wordSection = $('.WordSection1');
  const contextText = wordSection.length ? wordSection.text() : $('body').text();

  // District Name in Bengali
  let districtNameBn = DISTRICT_MAP.get(districtId)?.bengali || '';
  const pFirst = wordSection.find('p').first().text().trim();
  const distMatch = pFirst.match(/জেলা[:\s]+([\u0980-\u09FF\s]+?)(?:$|\s|[\.,])/) ||
                    contextText.match(/জেলা[:\s]+([\u0980-\u09FF]+)/);
  if (distMatch) {
    districtNameBn = distMatch[1].trim();
  }

  // Bulletin Number
  let bulletinNo = 0;
  const bMatch = contextText.match(/বুলেটিন নং\s*[:\s\-–—]*([০-৯0-9]+)/i);
  if (bMatch) {
    bulletinNo = parseInt(normalizeDigits(bMatch[1]), 10) || 0;
  }

  // Bulletin Date
  let bulletinDate = '';
  const dateMatch = contextText.match(/তারিখ\s*[:\s\-–—]*([০-৯0-9\.\-\/]+)/i);
  if (dateMatch) {
    bulletinDate = normalizeDateToISO(dateMatch[1]);
  }

  // Period
  let periodFrom = '';
  let periodTo = '';
  const periodMatch = contextText.match(/([০-৯0-9\.\-\/]+)\s*থেকে\s*([০-৯0-9\.\-\/]+)\s*(?:তারিখ\s*)?পর্যন্ত/);
  if (periodMatch) {
    periodFrom = normalizeDateToISO(periodMatch[1]);
    periodTo = normalizeDateToISO(periodMatch[2]);
  }

  // Find Weather Tables
  let pastTable: Parameters<cheerio.CheerioAPI>[0] | undefined = undefined;
  let forecastTable: Parameters<cheerio.CheerioAPI>[0] | undefined = undefined;

  $('table').each((_, el) => {
    // Check preceding text or container text
    const prevText = $(el).prev().text() || $(el).parent().prev().text() || '';
    const tblText = $(el).text();
    const cols = $(el).find('tr').first().find('td, th').length;

    if (
      prevText.includes('গত ৪ দিনের') ||
      prevText.includes('গত ৪ দিন') ||
      (tblText.includes('বৃষ্টিপাত') && cols === 6)
    ) {
      if (!pastTable) pastTable = el;
    }

    if (
      prevText.includes('আগামী ৫ দিনের') ||
      prevText.includes('পূর্বাভাস') ||
      (tblText.includes('বৃষ্টিপাত') && cols === 7)
    ) {
      if (!forecastTable) forecastTable = el;
    }
  });

  const pastWeather = pastTable ? parseWeatherTable($, pastTable) : [];
  const forecast = forecastTable ? parseWeatherTable($, forecastTable) : [];

  if (pastWeather.length === 0 && forecast.length === 0) {
    console.error(
      `[BAMIS PARSER ERROR] BAMIS layout may have changed: No weather rows found for district ${districtId}. URL: https://www.bamis.gov.bd/bulletin/district/current/${districtId}`
    );
    throw new Error(`BAMIS layout may have changed: No weather rows found for district ${districtId}`);
  }

  const advice = parseAdvice($);
  if (advice.length === 0) {
    console.warn(`[BAMIS PARSER WARNING] No advice sections found for district ${districtId}`);
  }

  return {
    districtId,
    districtNameBn,
    bulletinNo,
    bulletinDate,
    periodFrom,
    periodTo,
    pastWeather,
    forecast,
    advice,
    sourceUrl: `https://www.bamis.gov.bd/bulletin/district/current/${districtId}`,
    fetchedAt: new Date().toISOString()
  };
}
