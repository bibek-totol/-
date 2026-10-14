const fs = require('fs');
const cheerio = require('cheerio');

const html27 = fs.readFileSync('./fixtures/district_27.html', 'utf8');
const $ = cheerio.load(html27);

// Find the forecast table (table with 5 forecast dates or text containing পূর্বাভাস)
const forecastTable = $('table').filter((i, el) => {
  return $(el).text().includes('বৃষ্টিপাত') && $(el).find('tr').first().find('td, th').length === 7;
}).first();

console.log('Forecast table found?', forecastTable.length > 0);

// Let's inspect the container that holds the forecast table and advice
const container = forecastTable.closest('div');
console.log('Container div class/id:', container.attr('class'), container.attr('id'));

// Let's look at all paragraphs/elements after table 3 in the main bulletin container
let el = forecastTable;
while (el.length && !el.is('body')) {
  const nextSiblings = el.nextAll();
  if (nextSiblings.length > 0) {
    console.log(`Found ${nextSiblings.length} next siblings at level <${el.parent().prop('tagName')}>`);
    nextSiblings.each((i, s) => {
      const htmlSnippet = $.html(s);
      if (htmlSnippet.length < 500) {
        console.log(`Sibling #${i} [${s.tagName}]:`, htmlSnippet.trim());
      } else {
        console.log(`Sibling #${i} [${s.tagName}] (len ${htmlSnippet.length}):`, $(s).text().slice(0, 100));
      }
    });
    break;
  }
  el = el.parent();
}
