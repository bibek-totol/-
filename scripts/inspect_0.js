const fs = require('fs');

const html0 = fs.readFileSync('./fixtures/district_0.html', 'utf8');

const selectMatches0 = html0.match(/<select[\s\S]*?<\/select>/gi) || [];
console.log('district_0 select count:', selectMatches0.length);
selectMatches0.forEach((s, idx) => {
  console.log(`Select #${idx}:`, s.slice(0, 300));
  const options = [...s.matchAll(/<option\s+value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/gi)]
    .map(m => ({ val: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }));
  console.log('Options count:', options.length);
  console.log('Options:', options);
});

// Check links to /bulletin/district/current/
const districtLinks = [...html0.matchAll(/href=["']([^"']*bulletin\/district\/current\/\d+[^"']*)["']/gi)].map(m => m[1]);
console.log('districtLinks in 0:', districtLinks.length, districtLinks.slice(0, 15));

// Check any other links or map on page 0
const allLinks = [...html0.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
const uniqueDistrictUrls = [...new Set(allLinks.filter(l => l.includes('bulletin/district')))];
console.log('uniqueDistrictUrls in 0:', uniqueDistrictUrls);
