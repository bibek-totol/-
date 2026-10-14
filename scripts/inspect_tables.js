const fs = require('fs');

const html27 = fs.readFileSync('./fixtures/district_27.html', 'utf8');
const tables = [...html27.matchAll(/<table[\s\S]*?<\/table>/gi)].map(m => m[0]);

console.log('TABLE #0 ROWS:');
const rows0 = [...tables[0].matchAll(/<tr[\s\S]*?<\/tr>/gi)].map(r => r[0]);
rows0.forEach((r, idx) => {
  const cells = [...r.matchAll(/<t[dh][\s\S]*?<\/t[dh]>/gi)].map(c => 
    c[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  );
  console.log(`Row ${idx}:`, cells);
});

console.log('\nTABLE #1 (PAST WEATHER) ROWS:');
const rows1 = [...tables[1].matchAll(/<tr[\s\S]*?<\/tr>/gi)].map(r => r[0]);
rows1.forEach((idx, rIdx) => {
  // wait, rows1 elements are string
  const r = idx;
  const cells = [...r.matchAll(/<t[dh][\s\S]*?<\/t[dh]>/gi)].map(c => 
    c[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  );
  console.log(`Row ${rIdx}:`, cells);
});

// Also check the headings above Table #1 and Table #2
const t1Index = html27.indexOf(tables[1]);
const beforeT1 = html27.slice(Math.max(0, t1Index - 600), t1Index);
console.log('\n--- Text before Table #1 ---');
console.log(beforeT1.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

const t2Index = html27.indexOf(tables[2]);
const beforeT2 = html27.slice(Math.max(0, t2Index - 600), t2Index);
console.log('\n--- Text before Table #2 ---');
console.log(beforeT2.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
