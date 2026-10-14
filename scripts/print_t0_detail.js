const fs = require('fs');
const html27 = fs.readFileSync('./fixtures/district_27.html', 'utf8');

const t0Start = html27.indexOf('<table');
const t1Start = html27.indexOf('<table', t0Start + 1);

const t0 = html27.slice(t0Start, t1Start);
console.log('Between t0 and t1 length:', t0.length);
console.log(t0.slice(1000));
