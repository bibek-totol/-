const fs = require('fs');
const cheerio = require('cheerio');

async function checkIds() {
  for (const id of [11, 17, 27, 24, 1, 2]) {
    try {
      const res = await fetch(`https://www.bamis.gov.bd/bulletin/district/current/${id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const html = await res.text();
      const $ = cheerio.load(html);

      // Where is district name in bulletin?
      // 1. Check .WordSection1 p:first-child
      const pFirst = $('.WordSection1 p').first().text().trim();

      // 2. Check any element matching "জেলা:"
      const distMatches = [];
      $('*').each((i, el) => {
        const t = $(el).clone().children().remove().end().text().trim();
        if (t.includes('জেলা:') || t.includes('জেলা :')) {
          distMatches.push(t);
        }
      });

      // 3. Check dropdown selected option or dropdown in general
      const selOpt = $(`#district option[selected]`).text().trim();
      const optVal = $(`#district option[value="${id}"]`).text().trim();

      console.log(`\nID ${id}:`);
      console.log(`  pFirst: "${pFirst}"`);
      console.log(`  distMatches:`, distMatches.slice(0, 3));
      console.log(`  selectedOption: "${selOpt}"`);
      console.log(`  optionForId: "${optVal}"`);
      console.log(`  WordSection1 length:`, $('.WordSection1').length);
      console.log(`  AiContent length:`, $('#AiContent').length);
    } catch (e) {
      console.log(`ID ${id} error:`, e.message);
    }
  }
}

checkIds();
