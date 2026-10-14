const fs = require('fs');
const cheerio = require('cheerio');

for (const id of [27, 24]) {
  console.log(`\n================ INSPECTING #AiContent FOR DISTRICT ${id} ================`);
  const html = fs.readFileSync(`./fixtures/district_${id}.html`, 'utf8');
  const $ = cheerio.load(html);

  const aiContent = $('#AiContent');
  console.log('AiContent found?', aiContent.length > 0);
  console.log('Direct children count:', aiContent.children().length);

  // Let's print tag names of direct children
  aiContent.children().each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text) {
      console.log(`  [${i}] <${el.tagName}> class="${$(el).attr('class') || ''}": ${text.slice(0, 80)}`);
    }
  });
}
