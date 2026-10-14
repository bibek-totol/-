const fs = require('fs');
const cheerio = require('cheerio');

function bnToEnDigits(str) {
  if (!str) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[০-৯]/g, d => bnDigits.indexOf(d).toString());
}

function parseBnDate(str) {
  if (!str) return '';
  const normalized = bnToEnDigits(str.trim());
  const match = normalized.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (!match) return '';
  const day = match[1].padStart(2, '0');
  const month = match[2].padStart(2, '0');
  const year = match[3];
  return `${year}-${month}-${day}`;
}

function parseTest(html, districtId) {
  const $ = cheerio.load(html);

  // Metadata
  const fullText = $.text();
  const wordSection = $('.WordSection1');
  const text = wordSection.length ? wordSection.text() : fullText;

  // District name
  let districtNameBn = '';
  const distMatch = text.match(/জেলা[:\s]+([\u0980-\u09FF]+)/);
  if (distMatch) {
    districtNameBn = distMatch[1].trim();
  }

  // Bulletin No
  let bulletinNo = 0;
  const bMatch = text.match(/বুলেটিন নং\s*[:\s\-–—]*([০-৯0-9]+)/);
  if (bMatch) {
    bulletinNo = parseInt(bnToEnDigits(bMatch[1]), 10);
  }

  // Bulletin Date
  let bulletinDate = '';
  const dateMatch = text.match(/তারিখ\s*[:\s\-–—]*([০-৯0-9\.]+)/);
  if (dateMatch) {
    bulletinDate = parseBnDate(dateMatch[1]);
  }

  // Period
  let periodFrom = '';
  let periodTo = '';
  const periodMatch = text.match(/([০-৯0-9\.]+)\s*থেকে\s*([০-৯0-9\.]+)\s*পর্যন্ত/);
  if (periodMatch) {
    periodFrom = parseBnDate(periodMatch[1]);
    periodTo = parseBnDate(periodMatch[2]);
  }

  console.log({
    districtId,
    districtNameBn,
    bulletinNo,
    bulletinDate,
    periodFrom,
    periodTo
  });
}

console.log('Testing metadata extraction:');
parseTest(fs.readFileSync('./fixtures/district_27.html', 'utf8'), 27);
parseTest(fs.readFileSync('./fixtures/district_24.html', 'utf8'), 24);
