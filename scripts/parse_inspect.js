const fs = require('fs');
const cheerio = require('cheerio');

function inspectPage(filePath, districtId) {
  console.log(`\n==================================================`);
  console.log(`INSPECTING DISTRICT ${districtId} (${filePath})`);
  console.log(`==================================================`);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // Check title & headings
  console.log('Page Title:', $('title').text().trim());
  $('h1, h2, h3, h4').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text) console.log(`${el.tagName}: ${text}`);
  });

  // Find all tables
  console.log(`\nTotal tables found: ${$('table').length}`);
  
  // Let's inspect each table and its surrounding text
  $('table').each((i, el) => {
    const prevText = $(el).prev().text().replace(/\s+/g, ' ').trim() || 
                     $(el).parent().prev().text().replace(/\s+/g, ' ').trim();
    const rows = $(el).find('tr');
    console.log(`\nTable #${i}: rows=${rows.length}, prevText snippet="${prevText.slice(0, 100)}"`);
    
    // Sample first 3 rows
    rows.slice(0, 4).each((rIdx, rEl) => {
      const cells = $(rEl).find('td, th').map((cIdx, cEl) => $(cEl).text().replace(/\s+/g, ' ').trim()).get();
      console.log(`  Row ${rIdx} (${cells.length} cells):`, cells.slice(0, 7));
    });
  });

  // Find metadata: bulletin number, dates, district name
  console.log('\n--- Searching for metadata in text ---');
  const bodyText = $('body').text();
  const bulletinNoMatch = bodyText.match(/বুলেটিন\s*(?:নং|নম্বর)?[:\s\-–—]*([০-৯0-9]+)/i);
  console.log('Bulletin No Match:', bulletinNoMatch ? bulletinNoMatch[0] : 'Not found');

  const dateMatch = bodyText.match(/তারিখ\s*[:\s\-–—]*([০-৯0-9\.\-\/]+)/i);
  console.log('Date Match:', dateMatch ? dateMatch[0] : 'Not found');

  const periodMatch = bodyText.match(/([০-৯0-9\.\/]+)\s*থেকে\s*([০-৯0-9\.\/]+)\s*(?:তারিখ\s*)?পর্যন্ত/);
  console.log('Period Match:', periodMatch ? periodMatch[0] : 'Not found');

  // Let's inspect where district name and bulletin no are in the top table
  $('table').first().find('tr').each((rIdx, rEl) => {
    const text = $(rEl).text().replace(/\s+/g, ' ').trim();
    if (text.includes('বুলেটিন') || text.includes('জেলা') || text.includes('তারিখ') || text.includes('নম্বর') || text.includes('নং')) {
      console.log(`Table 0 row ${rIdx} meta snippet:`, text);
    }
  });

  // Let's inspect advice sections
  console.log('\n--- Inspecting Advice Sections ---');
  // Find paragraphs or elements after the forecast table
  // Let's find the forecast table
  let forecastTable = null;
  $('table').each((i, el) => {
    const text = $(el).text();
    if (text.includes('পূর্বাভাস') || text.includes('আগামী')) {
      forecastTable = $(el);
    }
  });

  // If table text itself doesn't contain it, let's find the table that has 5 forecast dates
  if (!forecastTable) {
    $('table').each((i, el) => {
      const headerText = $(el).find('tr').first().text();
      // Forecast has 5 dates + param + range = 7 columns
      const cols = $(el).find('tr').first().find('td, th').length;
      if (cols === 7) {
        forecastTable = $(el);
        console.log(`Found 7-column table (likely forecast) at index ${i}`);
      }
    });
  }

  // Look at elements following forecast table
  if (forecastTable) {
    // Collect subsequent siblings or elements
    let curr = forecastTable.next();
    let count = 0;
    while (curr.length && count < 30) {
      const text = curr.text().replace(/\s+/g, ' ').trim();
      const tagName = curr.prop('tagName');
      if (text) {
        console.log(`Following elem <${tagName}> (class="${curr.attr('class') || ''}"): ${text.slice(0, 120)}`);
      }
      curr = curr.next();
      count++;
    }
    // Also check parent's siblings if curr ran out
    if (count === 0 || !curr.length) {
      let pCurr = forecastTable.parent().next();
      let pCount = 0;
      while (pCurr.length && pCount < 20) {
        const text = pCurr.text().replace(/\s+/g, ' ').trim();
        const tagName = pCurr.prop('tagName');
        if (text) {
          console.log(`Parent sibling <${tagName}>: ${text.slice(0, 120)}`);
        }
        pCurr = pCurr.next();
        pCount++;
      }
    }
  }
}

inspectPage('./fixtures/district_27.html', 27);
inspectPage('./fixtures/district_24.html', 24);
