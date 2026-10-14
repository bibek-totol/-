import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseBulletin } from '@/lib/bamis/parseBulletin';

describe('parseBulletin with real BAMIS fixtures', () => {
  const html27 = fs.readFileSync(path.resolve(__dirname, '../fixtures/district_27.html'), 'utf8');
  const html24 = fs.readFileSync(path.resolve(__dirname, '../fixtures/district_24.html'), 'utf8');

  it('parses District 27 (Thakurgaon) correctly with exact matching numbers', () => {
    const bulletin = parseBulletin(html27, 27);

    expect(bulletin.districtId).toBe(27);
    expect(bulletin.districtNameBn).toBe('ঠাকুরগাঁও');
    expect(bulletin.bulletinNo).toBe(767);
    expect(bulletin.bulletinDate).toBe('2026-10-11');
    expect(bulletin.periodFrom).toBe('2026-10-11');
    expect(bulletin.periodTo).toBe('2026-10-15');

    // Past 4 days weather
    expect(bulletin.pastWeather).toHaveLength(4);
    const past0 = bulletin.pastWeather[0];
    expect(past0.date).toBe('2026-10-07');
    expect(past0.rainMm).toBe(0.0);
    expect(past0.maxTempC).toBe(32.4);
    expect(past0.minTempC).toBe(24.0);
    expect(past0.humidity).toEqual({ min: 61.0, max: 94.0 });
    expect(past0.windSpeedKmh).toBe(1.6);
    expect(past0.windDirection).toBe('পশ্চিম/উত্তর-পশ্চিম দিক');
    expect(past0.cloud).toBe(0);

    const past1 = bulletin.pastWeather[1];
    expect(past1.date).toBe('2026-10-08');
    expect(past1.rainMm).toBe(19.0);
    expect(past1.maxTempC).toBe(33.2);
    expect(past1.minTempC).toBe(24.2);
    expect(past1.cloud).toBe(6);

    // 5-day forecast
    expect(bulletin.forecast).toHaveLength(5);
    const f0 = bulletin.forecast[0];
    expect(f0.date).toBe('2026-10-11');
    expect(f0.rainMm).toBe(0.0);
    expect(f0.maxTempC).toBe(30.7);
    expect(f0.minTempC).toBe(21.3);
    expect(f0.humidity).toEqual({ min: 51.4, max: 90.3 });
    expect(f0.windSpeedKmh).toBe(7.9);
    expect(f0.cloud).toBe('পরিষ্কার');

    const f1 = bulletin.forecast[1];
    expect(f1.date).toBe('2026-10-12');
    expect(f1.maxTempC).toBe(32.2);
    expect(f1.minTempC).toBe(19.9);

    // Advice sections
    expect(bulletin.advice.length).toBeGreaterThan(0);
    const titles = bulletin.advice.map((a) => a.title);
    expect(titles).toContain('ধান আমন');
    expect(titles).toContain('সবজি');
    expect(titles).toContain('গবাদি পশু');

    const paddyAdvice = bulletin.advice.find((a) => a.title === 'ধান আমন');
    expect(paddyAdvice?.items[0]).toContain('জমির পানির স্তর ২-৫ সেমি বজায় রাখুন');
  });

  it('parses District 24 (Barguna) with crop stages and exact numbers', () => {
    const bulletin = parseBulletin(html24, 24);

    expect(bulletin.districtId).toBe(24);
    expect(bulletin.districtNameBn).toBe('বরগুনা');
    expect(bulletin.bulletinNo).toBe(767);
    expect(bulletin.bulletinDate).toBe('2026-10-11');

    // Past weather
    expect(bulletin.pastWeather).toHaveLength(4);
    expect(bulletin.pastWeather[1].rainMm).toBe(1.0);
    expect(bulletin.pastWeather[1].maxTempC).toBe(33.5);
    expect(bulletin.pastWeather[1].minTempC).toBe(25.4);

    // Forecast weather
    expect(bulletin.forecast).toHaveLength(5);
    expect(bulletin.forecast[0].maxTempC).toBe(33.1);
    expect(bulletin.forecast[0].minTempC).toBe(22.8);
    expect(bulletin.forecast[3].maxTempC).toBe(34.5);
    expect(bulletin.forecast[3].minTempC).toBe(22.2);

    // Advice sections with crop stage
    const paddyAdvice = bulletin.advice.find((a) => a.title === 'ধান আমন');
    expect(paddyAdvice).toBeDefined();
    expect(paddyAdvice?.stage).toBe('দানা জমাট বাঁধা');
    expect(paddyAdvice?.items).toContain('সেচ প্রয়োগ করুন।');
  });

  it('throws an informative error if HTML does not contain weather tables', () => {
    const emptyHtml = '<html><body><h1>No bulletin here</h1></body></html>';
    expect(() => parseBulletin(emptyHtml, 99)).toThrowError(
      /BAMIS layout may have changed/
    );
  });
});
