const fs = require('fs');
const cheerio = require('cheerio');

const html27 = fs.readFileSync('./fixtures/district_27.html', 'utf8');
const $ = cheerio.load(html27);

// Find where "ধান আমন" is in the document
const match = $("*:contains('ধান আমন')").last();
console.log('Element containing "ধান আমন":', match.prop('tagName'), 'Class:', match.attr('class'), 'Parent:', match.parent().prop('tagName'));

// Let's trace parents up to body
let p = match;
while (p.length && !p.is('body')) {
  console.log(`Node: <${p.prop('tagName')}> class="${p.attr('class') || ''}" id="${p.attr('id') || ''}"`);
  p = p.parent();
}

// Let's inspect the container that holds the advice
const parentContainer = match.parent();
console.log('Parent container children count:', parentContainer.children().length);
parentContainer.children().slice(0, 30).each((i, el) => {
  const text = $(el).text().replace(/\s+/g, ' ').trim();
  if (text) {
    console.log(`Child #${i} <${el.tagName}> (class="${$(el).attr('class') || ''}", bold=${$(el).find('strong, b').length > 0 || $(el).is('strong, b')}): ${text.slice(0, 100)}`);
  }
});
