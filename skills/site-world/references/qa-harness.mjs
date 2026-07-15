// site-world QA harness — node qa-harness.mjs <url> [outdir]
// Requires playwright (npm i playwright). Produces screenshots + a JSON report:
//   - full-page shots at desktop (1440) and phone (390) widths
//   - reduced-motion full-page shot (must show settled states)
//   - horizontal-overflow check at both widths
//   - console errors / failed requests
//   - raw-hex token audit (inline styles + <style> outside theme.css)
//   - transfer-weight budget
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const url = process.argv[2];
const out = process.argv[3] || 'qa-out';
if (!url) { console.error('usage: node qa-harness.mjs <url> [outdir]'); process.exit(2); }
mkdirSync(out, { recursive: true });

const report = { url, passes: {}, errors: [], failedRequests: [], weightKB: 0 };
const browser = await chromium.launch();

async function pass(name, { width, height, reducedMotion }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  let bytes = 0;
  page.on('console', m => { if (m.type() === 'error') report.errors.push(`[${name}] ${m.text()}`); });
  page.on('requestfailed', r => report.failedRequests.push(`[${name}] ${r.url()}`));
  page.on('response', async r => { try { bytes += (await r.body()).length; } catch {} });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  // trigger every reveal: walk the page slowly, then return to top
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y <= h; y += innerHeight * 0.7) {
      scrollTo(0, y); await new Promise(r => setTimeout(r, 180));
    }
    scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
  });

  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  report.passes[name] = { overflowPx: overflow, ok: overflow <= 1 };
  if (name === 'desktop') report.weightKB = Math.round(bytes / 1024);

  if (name === 'desktop') {
    // token audit: raw hex in inline styles or non-theme <style> blocks
    report.tokenViolations = await page.evaluate(() => {
      const hex = /#[0-9a-fA-F]{3,8}\b/;
      const v = [];
      document.querySelectorAll('[style]').forEach(n => {
        if (hex.test(n.getAttribute('style')) && !n.closest('[data-st-prefreeze]'))
          v.push('inline: ' + n.getAttribute('style').slice(0, 80));
      });
      document.querySelectorAll('style:not(#st-theme)').forEach(s => {
        const m = s.textContent.match(new RegExp(hex, 'g'));
        if (m) v.push('style-block: ' + [...new Set(m)].join(' '));
      });
      return v.slice(0, 20);
    });
  }
  await ctx.close();
}

await pass('desktop', { width: 1440, height: 900 });
await pass('phone', { width: 390, height: 844 });
await pass('reduced-motion', { width: 1440, height: 900, reducedMotion: true });
await browser.close();

report.ok =
  Object.values(report.passes).every(p => p.ok) &&
  report.errors.length === 0 &&
  report.failedRequests.length === 0;
writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
console.log(report.ok ? 'QA: PASS (now self-review screenshots against qa-rubric.md)' : 'QA: FAIL');
process.exit(report.ok ? 0 : 1);
