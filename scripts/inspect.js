const fs = require('fs');

const html27 = fs.readFileSync('./fixtures/district_27.html', 'utf8');

// Look for <select> elements
const selectMatches = html27.match(/<select[\s\S]*?<\/select>/gi) || [];
console.log('=== SELECT ELEMENTS ===');
selectMatches.forEach((s, idx) => {
  const nameMatch = s.match(/name=["']([^"']+)["']/i);
  const idMatch = s.match(/id=["']([^"']+)["']/i);
  console.log(`Select #${idx} id="${idMatch ? idMatch[1] : ''}" name="${nameMatch ? nameMatch[1] : ''}"`);
  const options = [...s.matchAll(/<option\s+value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/gi)]
    .map(m => ({ val: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }));
  console.log('Options count:', options.length);
  console.log('Sample options:', options.slice(0, 10));
});

// Check PDF links
const pdfLinks = [...html27.matchAll(/href=["']([^"']+\.pdf[^"']*)["']/gi)].map(m => m[1]);
console.log('=== PDF LINKS ===', pdfLinks);

// Check scripts / APIs / fetch / ajax
const scripts = [...html27.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
console.log('Script count:', scripts.length);
const scriptUrls = scripts.join('\n').match(/https?:\/\/[^\s"']+/g) || [];
console.log('URLs in scripts:', scriptUrls.slice(0, 15));

// Check bulletin header/container
console.log('=== MAIN CONTENT STRUCTURE ===');
const h1s = [...html27.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].trim());
const h2s = [...html27.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].trim());
const h3s = [...html27.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(m => m[1].trim());
const h4s = [...html27.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/gi)].map(m => m[1].trim());
const h5s = [...html27.matchAll(/<h5[^>]*>([\s\S]*?)<\/h5>/gi)].map(m => m[1].trim());

console.log('h1:', h1s);
console.log('h2:', h2s);
console.log('h3:', h3s);
console.log('h4:', h4s);
console.log('h5:', h5s);

// Check tables
const tables = [...html27.matchAll(/<table[\s\S]*?<\/table>/gi)];
console.log('=== TABLE COUNT ===', tables.length);
tables.forEach((t, i) => {
  console.log(`--- Table #${i} ---`);
  // print first 400 chars of table
  console.log(t[0].slice(0, 400));
});
