const fs = require('fs');
const html27 = fs.readFileSync('./fixtures/district_27.html', 'utf8');

const t0Start = html27.indexOf('<table');
const t1Start = html27.indexOf('<table', t0Start + 1);

console.log('TABLE #0 RAW HTML:');
console.log(html27.slice(t0Start, t1Start));
