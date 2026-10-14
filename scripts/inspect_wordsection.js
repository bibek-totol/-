const fs = require('fs');
const cheerio = require('cheerio');

const html27 = fs.readFileSync('./fixtures/district_27.html', 'utf8');
const $ = cheerio.load(html27);

console.log('WordSection1 children count:', $('.WordSection1').children().length);
$('.WordSection1').children().each((i, el) => {
  const tagName = el.tagName;
  const text = $(el).text().replace(/\s+/g, ' ').trim();
  if (text.length > 0) {
    console.log(`Child #${i} <${tagName}> (class="${$(el).attr('class') || ''}"): ${text.slice(0, 100)}`);
  }
});

// Also check if there is WordSection2 or what comes after WordSection1
console.log('WordSection1 nextAll:', $('.WordSection1').nextAll().length);
$('.WordSection1').nextAll().each((i, el) => {
  const text = $(el).text().replace(/\s+/g, ' ').trim();
  if (text.length > 0) {
    console.log(`WordSection1 Sibling #${i} <${el.tagName}> (class="${$(el).attr('class') || ''}"): ${text.slice(0, 100)}`);
  }
});
