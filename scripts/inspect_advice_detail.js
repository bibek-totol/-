const fs = require('fs');
const cheerio = require('cheerio');

const html24 = fs.readFileSync('./fixtures/district_24.html', 'utf8');
const $ = cheerio.load(html24);

$('#AiContent > *').each((i, el) => {
  if (el.tagName === 'p') {
    console.log(`\n--- Heading: ${$(el).text().trim()} ---`);
  } else if (el.tagName === 'ul') {
    $(el).find('li').each((liIdx, liEl) => {
      console.log(`  LI [${liIdx}]:`, $(liEl).text().trim());
    });
  }
});
