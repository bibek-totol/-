const fs = require('fs');
const cheerio = require('cheerio');
const { normalizeDateToISO, parseNormalizedNumber, parseRange, parseWindSpeed, parseCloud, normalizeDigits } = require('./src/lib/bamis/normalize.ts');

function parseWeatherTable($, tableEl) {
  const rows = $(tableEl).find('tr');
  if (rows.length < 2) return [];

  // Extract date headers from row 0
  const headerCells = $(rows[0]).find('td, th').map((_, el) => $(el).text().replace(/\s+/g, ' ').trim()).get();
  
  // Find which column indices correspond to dates
  const dateColumns = [];
  for (let c = 1; c < headerCells.length; c++) {
    const text = headerCells[c];
    if (text.includes('সীমা')) continue; // Skip সীমা column
    const isoDate = normalizeDateToISO(text);
    if (isoDate) {
      dateColumns.push({ colIndex: c, date: isoDate, rawDate: text });
    }
  }

  if (dateColumns.length === 0) return [];

  // Map each date to a DayWeather object
  const days = dateColumns.map(d => ({
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
    const cells = $(rows[r]).find('td, th').map((_, el) => $(el).text().replace(/\s+/g, ' ').trim()).get();
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

function parseAdvice($) {
  const sections = [];
  const aiContent = $('#AiContent');

  if (aiContent.length > 0) {
    let currentTitle = '';
    let currentStage = undefined;
    let currentItems = [];

    aiContent.children().each((_, el) => {
      const tagName = el.tagName.toLowerCase();
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (!text) return;

      if (tagName === 'p' || tagName.startsWith('h')) {
        // Save previous section if exists
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
        $(el).find('li').each((_, li) => {
          const itemText = $(li).text().replace(/\s+/g, ' ').trim();
          if (!itemText) return;
          if (itemText.startsWith('পর্যায়:') || itemText.startsWith('পর্যায়:')) {
            currentStage = itemText.replace(/^পর্যা[যয়]:\s*/, '').trim();
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

const html27 = fs.readFileSync('./fixtures/district_27.html', 'utf8');
const $27 = cheerio.load(html27);
const tables27 = $27('table');
console.log('Testing Table 2 (Past):', parseWeatherTable($27, tables27[2]));
console.log('Testing Table 3 (Forecast):', parseWeatherTable($27, tables27[3]));
console.log('Testing Advice 27:', parseAdvice($27));
