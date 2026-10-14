const fs = require('fs');

for (const id of [27, 24]) {
  console.log(`\n================ DISTRICT ${id} METADATA ================`);
  const html = fs.readFileSync(`./fixtures/district_${id}.html`, 'utf8');

  // Let's find table #0 or everything up to table #1
  const t1Idx = html.indexOf('<table');
  const t2Idx = html.indexOf('<table', t1Idx + 1);
  const topSection = html.slice(0, t2Idx > 0 ? t2Idx : 5000);

  // Let's print all paragraphs / text before table #1
  const beforeT1 = html.slice(0, html.indexOf('গত ৪ দিনের আবহাওয়া'));
  // clean HTML tags
  const text = beforeT1.replace(/<style[\s\S]*?<\/style>/gi, '')
                       .replace(/<script[\s\S]*?<\/script>/gi, '')
                       .replace(/<[^>]+>/g, '\n')
                       .split('\n')
                       .map(s => s.trim())
                       .filter(Boolean);
  
  console.log('Top text lines:', text.slice(text.findIndex(t => t.includes('বুলেটিন') || t.includes('কৃষি সম্প্রসারণ') || t.includes('জেলা'))));
}
