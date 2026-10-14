const fs = require('fs');
const html27 = fs.readFileSync('./fixtures/district_27.html', 'utf8');

const t0Start = html27.indexOf('<table');
const t1Start = html27.indexOf('<table', t0Start + 1);

const t0 = html27.slice(t0Start, t1Start);
// Let's strip tags partially or look at text in row 2
const rows = t0.split('<tr');
console.log('Number of rows in t0:', rows.length);
for (let i = 0; i < rows.length; i++) {
  console.log(`\n--- ROW ${i} ---`);
  console.log(rows[i].replace(/<style[\s\S]*?<\/style>/gi, '')
                     .replace(/<[^>]+>/g, ' ')
                     .replace(/&nbsp;/g, ' ')
                     .replace(/\s+/g, ' ')
                     .trim());
}
