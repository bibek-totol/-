const fs = require('fs');

const html27 = fs.readFileSync('./fixtures/district_27.html', 'utf8');

// Find all elements containing "বুলেটিন" or "পরামর্শ"
console.log('--- Search for Bulletin headers ---');
const regexHeader = /<table[\s\S]*?<\/table>/gi;
const tables = [...html27.matchAll(regexHeader)].map(m => m[0]);
console.log(`Found ${tables.length} tables`);

tables.forEach((tbl, idx) => {
  console.log(`\n================ TABLE #${idx} ================`);
  // Print first few rows
  const rows = [...tbl.matchAll(/<tr[\s\S]*?<\/tr>/gi)].map(r => r[0]);
  console.log(`Row count: ${rows.length}`);
  rows.slice(0, 10).forEach((r, rIdx) => {
    // extract cell texts
    const cells = [...r.matchAll(/<t[dh][\s\S]*?<\/t[dh]>/gi)].map(c => 
      c[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    );
    console.log(`Row ${rIdx} (${cells.length} cells):`, cells);
  });
});

// Look for advice section structure
console.log('\n--- Searching for Advice section structure ---');
// Let's find headings after Table #2
const lastTableEnd = html27.lastIndexOf('</table>');
const afterTables = html27.slice(lastTableEnd + 8);
console.log('Length of text after last table:', afterTables.length);

// Let's look for paragraphs or headings in afterTables
const ps = [...afterTables.matchAll(/<(?:p|h\d|div|li|span)[^>]*>([\s\S]*?)<\/(?:p|h\d|div|li|span)>/gi)]
  .map(m => m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  .filter(t => t.length > 0 && t.length < 200);

console.log('Sample text snippets after tables:');
console.log(ps.slice(0, 40));
