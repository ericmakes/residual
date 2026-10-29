// Residual gauntlet harness — drives the real page in headless Chromium through public inputs only.
// Usage: node harness-residual.js <path-to-wrapped-app.html> <path-to-wrapped-landing.html>
const { chromium } = require('playwright');
const fs = require('fs');
const [,, APP, LANDING] = process.argv;
let F = []; const ok = (c, m) => { if (!c) F.push(m); };
const section = (n) => console.log('— ' + n);

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|fonts/.test(m.text())) errs.push('console: ' + m.text()); });
  const url = 'file://' + APP;
  const S = () => page.evaluate(() => JSON.parse(JSON.stringify(S)));
  const nav = async (label) => { await page.click(`nav >> text="${label}"`); await page.waitForTimeout(60); };
  const role = async (r) => { await page.click(`#role${r}`); await page.waitForTimeout(60); };
  const advance = async (n = 1) => { for (let i = 0; i < n; i++) { await page.click('#advBtn'); } await page.waitForTimeout(80); };
  const text = async () => (await page.textContent('#main')) || '';
  const fresh = async () => { await page.goto(url); await page.evaluate(() => { localStorage.clear(); }); await page.goto(url); await page.waitForTimeout(150); };

  // ---------- Phase 0: specimen ----------
  section('P0 specimen');
  const src = fs.readFileSync(APP, 'utf8');
  ok(src.length > 20000, 'app specimen too small: ' + src.length);
  for (const sig of ['KILL_DAYS', 'advanceDay', 'CHECKS', 'residual-v1', 'nextPayoutDay']) ok(src.includes(sig), 'missing signature ' + sig);

  // ---------- Phase 1: journey ----------
  section('P1 journey');
  await fresh();
  let st = await S();
  ok(st.day === 0 && st.role === 'brand' && st.view === 'briefs', 'boot state ' + JSON.stringify({ day: st.day, role: st.role, view: st.view }));
  for (const v of ['Briefs', 'Submissions', 'Launch', 'Ledger', 'History', 'New brief']) { await nav(v); ok((await text()).length > 100, 'brand view empty: ' + v); }
  await role('Creator');
  for (const v of ['Brief feed', 'My submissions', 'Earnings', 'Ledger']) { await nav(v); ok((await text()).length > 100, 'creator view empty: ' + v); }
  // 2026-10-29 added: creator ledger mirrors the brand ledger for the creator's own videos (design-critic HIGH)
  st = await S(); { const mine = new Set(st.subs.filter(x => x.creatorId === 'c1').map(x => x.id)); const n = st.ledger.filter(l => mine.has(l.subId)).length; const shown = (await page.locator('#main tbody tr').count()); ok(n > 0 && shown === Math.min(n, 60), 'creator ledger rows ' + shown + ' vs ledger lines ' + n); }
  { const kill0 = st.subs.filter(x => x.status === 'approved').map(x => ({ id: x.id, t: st.briefs.find(b => b.id === x.briefId).rule.type, fp: x.flatPaid })); ok(kill0.every(k => k.t !== 'flat' || k.fp > 0), 'approved flat-rule video without flatPaid: ' + JSON.stringify(kill0)); }
  // seeded ledger integrity at boot
  st = await S();
  const seedSpend = st.ledger.filter(l => l.kind === 'spend');
  ok(seedSpend.length >= 10, 'seed ledger thin: ' + seedSpend.length);
  ok(seedSpend.every(l => Math.abs(l.fee - l.amount * 0.01) < 1e-6), 'seed fee ≠ 1% somewhere');
  // every running seeded sub with a flat component should have flatPaid recorded
  for (const s of st.subs) { const b = st.briefs.find(x => x.id === s.briefId); if (s.status === 'running' && b.rule.flat) ok(s.flatPaid === b.rule.flat, `seed: ${s.id} running on flat+pct rule but flatPaid=${s.flatPaid}`); }

  // ---------- Phase 2: systems ----------
  section('P2 gate law');
  await role('Brand'); await nav('Submissions');
  let approveBtn = page.locator('button:has-text("Approve")').first();
  ok(await approveBtn.isDisabled(), 'Approve enabled with 0/4 ticked');
  await page.click('#ck-s3-0'); await page.click('#ck-s3-1'); await page.waitForTimeout(60);
  approveBtn = page.locator('button:has-text("Approve")').first();
  ok(await approveBtn.isDisabled(), 'Approve enabled with 2/4 ticked');
  // revise names FIRST unticked (index 2)
  await page.click('button:has-text("Revise")'); await page.waitForTimeout(60);
  st = await S(); let s3 = st.subs.find(s => s.id === 's3');
  // 2026-10-29 amended: revise now names EVERY unticked item (compliance HIGH), and MX fintech has 4 items
  ok(s3.status === 'revise' && s3.note.includes('Promo named is live') && s3.note.includes('No return, yield'), 'revise note: ' + s3.note);
  // creator resubmits, brand ticks all, approve unlocks
  await role('Creator'); await nav('My submissions'); await page.click('button:has-text("Re-submit")'); await page.waitForTimeout(60);
  st = await S(); s3 = st.subs.find(s => s.id === 's3'); // 2026-10-29 amended: a re-submitted cut is re-checked from scratch and versioned (compliance HIGH)
  ok(s3.status === 'review' && s3.checks.every(c => c === false) && s3.file === 'sofia_fees_mx_v2.mp4' && s3.version === 2, 'resubmit: ' + s3.status + ' ' + s3.file + ' ' + JSON.stringify(s3.checks));
  await role('Brand'); await nav('Submissions');
  await page.click('#ck-s3-0'); await page.click('#ck-s3-1'); await page.click('#ck-s3-2'); await page.click('#ck-s3-3'); await page.waitForTimeout(60);
  approveBtn = page.locator('button:has-text("Approve")').first();
  ok(!(await approveBtn.isDisabled()), 'Approve still locked at 4/4');
  // revise at 4/4 must refuse
  await page.click('button:has-text("Revise")'); await page.waitForTimeout(60);
  st = await S(); ok(st.subs.find(s => s.id === 's3').status === 'review', 'revise at 4/4 changed status');
  await page.click('button:has-text("Approve")'); await page.waitForTimeout(60);
  st = await S(); s3 = st.subs.find(s => s.id === 's3');
  ok(s3.status === 'approved' && s3.approvedDay === 0, 'approve: ' + s3.status + ' day ' + s3.approvedDay);

  section('P2 kill-fee law');
  // s2 approved day -3 → kills when day reaches 11; s3 approved day 0 → kills at day 14; s6 flat rule kill 0 → never kills
  await advance(10);
  st = await S(); ok(st.subs.find(s => s.id === 's2').status === 'approved', 's2 killed early at day 10');
  await advance(1);
  st = await S(); let s2 = st.subs.find(s => s.id === 's2');
  ok(s2.status === 'killed' && s2.killPaid === 25, 's2 at day 11: ' + s2.status + ' killPaid=' + s2.killPaid);
  ok(st.ledger.some(l => l.kind === 'kill' && l.subId === 's2' && l.creatorShare === 25), 'no kill ledger line for s2');
  await advance(3);
  st = await S(); s3 = st.subs.find(s => s.id === 's3');
  ok(s3.status === 'killed', 's3 at day 14: ' + s3.status);
  ok(st.subs.find(s => s.id === 's6').status === 'approved', 's6 (kill=0 flat) was killed');
  // creator sees the kill fee as earned
  await role('Creator'); await nav('Earnings');
  ok((await text()).includes('Kill fee paid'), 'creator earnings does not show kill fee');

  section('P2 payout law');
  st = await S();
  const payouts = st.ledger.filter(l => l.kind === 'payout').sort((a, b) => a.day - b.day);
  ok(payouts.length >= 3, 'expected ≥3 payouts by day 14, got ' + payouts.length + ' at days ' + payouts.map(p => p.day));
  const gaps = payouts.slice(1).map((p, i) => p.day - payouts[i].day);
  ok(gaps.every(g => g === 7), 'payout cadence not weekly: ' + gaps);
  const owed = st.subs.reduce((a, s) => a + (s.spend.reduce((x, y) => x + y.share, 0) + (s.killPaid || 0) + (s.flatPaid || 0)) - s.paid, 0);
  ok(owed >= -0.01, 'negative owed after payout: ' + owed);
  const lastPay = payouts[payouts.length - 1];
  // conservation: total creator value = paid + owed
  const totalValue = st.subs.reduce((a, s) => a + s.spend.reduce((x, y) => x + y.share, 0) + (s.killPaid || 0) + (s.flatPaid || 0), 0);
  const totalPaid = st.subs.reduce((a, s) => a + s.paid, 0);
  ok(Math.abs(totalValue - totalPaid - owed) < 0.01, 'conservation broken');
  ok(Math.abs(payouts.reduce((a, p) => a + p.amount, 0) - totalPaid) < 0.01, 'sum(payout entries) ≠ sum(paid): ' + payouts.reduce((a, p) => a + p.amount, 0) + ' vs ' + totalPaid);

  section('P2 cap + fee law (soak 60 days)');
  await advance(60);
  st = await S();
  const s1 = st.subs.find(s => s.id === 's1');
  const share1 = s1.spend.reduce((a, x) => a + x.share, 0);
  ok(share1 <= 400 + 1e-6, 's1 share exceeded $400 cap: ' + share1);
  ok(share1 > 300, 's1 share suspiciously low after 70 days: ' + share1);
  ok(st.ledger.filter(l => l.kind === 'spend').every(l => Math.abs(l.fee - l.amount * 0.01) < 1e-6), 'fee ≠ 1% of spend somewhere');
  ok(st.subs.filter(s => s.status === 'running').every(s => s.spend.length >= 60), 'running video missing daily spend lines');
  ok(errs.length === 0, 'page errors during soak: ' + errs.join(' | '));

  section('P2 launch + ad ID');
  await fresh();
  await role('Brand'); await nav('Launch');
  await page.locator('tr:has-text("vale_notificacion") button:has-text("TikTok")').click(); await page.waitForTimeout(60);
  st = await S(); s2 = st.subs.find(s => s.id === 's2');
  ok(s2.status === 'running' && s2.platform === 'TikTok' && /^1812\d{12}$/.test(s2.adId), 'launch: ' + JSON.stringify({ st: s2.status, p: s2.platform, id: s2.adId }));
  ok(s2.spend.length === 0, 'spend before first day');
  await advance(1);
  st = await S(); s2 = st.subs.find(s => s.id === 's2');
  ok(s2.spend.length === 1 && s2.spend[0].day === 0, 'first spend line after launch: ' + JSON.stringify(s2.spend));
  // pause stops spend, resume restarts
  await nav('Launch'); await page.locator('tr:has-text("vale_notificacion") button:has-text("Pause")').click(); await advance(2);
  st = await S(); ok(st.subs.find(s => s.id === 's2').spend.length === 1, 'paused video still accrued spend');
  await nav('Launch'); await page.locator('tr:has-text("vale_notificacion") button:has-text("Resume")').click(); await advance(1);
  st = await S(); ok(st.subs.find(s => s.id === 's2').spend.length === 2, 'resumed video did not accrue');

  section('P2 many ad IDs per video (media-buyer HIGH, added 2026-10-29)');
  await fresh(); await role('Brand'); await nav('Launch');
  await page.locator('tr:has-text("vale_notificacion") button:has-text("Meta")').click(); await page.waitForTimeout(60);
  await page.locator('tr:has-text("vale_notificacion") button:has-text("+TikTok")').click(); await page.waitForTimeout(60);
  st = await S(); s2 = st.subs.find(s => s.id === 's2');
  ok(s2.ads && s2.ads.length === 2 && s2.ads[0].platform === 'Meta' && s2.ads[1].platform === 'TikTok', 'two ad IDs not attached: ' + JSON.stringify(s2.ads));
  await advance(1);
  st = await S(); s2 = st.subs.find(s => s.id === 's2');
  const day0 = s2.spend.filter(x => x.day === 0);
  ok(day0.length === 2 && new Set(day0.map(x => x.adId)).size === 2, 'expected one spend line per ad ID: ' + JSON.stringify(day0));
  ok(st.ledger.filter(l => l.subId === 's2' && l.kind === 'spend' && l.day === 0).length === 2, 'ledger not per ad ID');
  const s1l = st.subs.find(s => s.id === 's1'); ok(s1l.ads.length === 2 && s1l.spend.filter(x => x.day === -1).length === 2, 'seeded two-ad-set video has one line per day');

  section('P2 run-or-pay clock keys on spend (launch-then-pause loophole)');
  await fresh(); await role('Brand'); await nav('Launch');
  await page.locator('tr:has-text("vale_notificacion") button:has-text("Meta")').click(); await page.waitForTimeout(60);
  await page.locator('tr:has-text("vale_notificacion") button:has-text("Pause")').click(); await page.waitForTimeout(60);
  await advance(11);
  st = await S(); s2 = st.subs.find(s => s.id === 's2');
  ok(s2.status === 'killed' && s2.killPaid === 25, 'LOOPHOLE: launched+paused with $0 spend escaped the kill clock: ' + s2.status);
  ok((s2.audit || []).some(a => a.action === 'kill fee triggered'), 'kill not in audit log');
  // a video that genuinely ran past the minimum spend must NOT be killed when paused later
  await fresh(); await role('Brand'); await nav('Launch');
  await page.locator('tr:has-text("vale_notificacion") button:has-text("Meta")').click(); await advance(2);
  await nav('Launch'); await page.locator('tr:has-text("vale_notificacion") button:has-text("Pause")').click(); await advance(12);
  st = await S(); s2 = st.subs.find(s => s.id === 's2');
  ok(s2.status === 'paused' && s2.spend.reduce((a, x) => a + x.amt, 0) >= 50, 'ran-then-paused video wrongly killed: ' + s2.status);

  section('P2 flat rule on approval');
  await fresh();
  await role('Brand'); await nav('Submissions');
  // dev_6am (s5) is in revise; resubmit as creator? s5 is Dev K, not me. Use s3 instead on b1 (pct). Create a flat brief via form and submit as creator.
  await nav('New brief');
  await page.fill('#nb-brand', 'TestCo'); await page.fill('#nb-product', 'Flat test');
  await page.fill('#nb-hooks', 'Hook one\nHook two');
  await page.click('#nb-mk-CO'); await page.selectOption('#nb-vertical', 'fintech'); await page.selectOption('#nb-rtype', 'flat'); await page.fill('#nb-flat', '75'); await page.fill('#nb-kill', '0');
  await page.click('button:has-text("Publish brief")'); await page.waitForTimeout(60);
  st = await S(); const nb = st.briefs[0]; ok(nb.brand === 'TestCo' && nb.rule.type === 'flat' && nb.rule.flat === 75 && nb.rule.pct === 0, 'new flat brief: ' + JSON.stringify(nb.rule));
  await role('Creator'); await nav('Brief feed');
  await page.fill(`#fl-${nb.id}`, 'flat_test.mp4'); await page.locator(`form:has(#fl-${nb.id}) button`).click(); await page.waitForTimeout(60);
  st = await S(); const ns = st.subs[0]; ok(ns.file === 'flat_test.mp4' && ns.checks.length === 4 && ns.market === 'CO', 'new sub: ' + JSON.stringify({ f: ns.file, c: ns.checks.length, m: ns.market }));
  await role('Brand'); await nav('Submissions');
  for (let i = 0; i < 4; i++) await page.click(`#ck-${ns.id}-${i}`);
  await page.locator(`.panel:has-text("flat_test.mp4") button:has-text("Approve")`).click(); await page.waitForTimeout(60);
  st = await S(); const ns2 = st.subs.find(s => s.id === ns.id);
  ok(ns2.status === 'approved' && ns2.flatPaid === 75, 'flat approval: ' + ns2.status + ' flatPaid=' + ns2.flatPaid);
  ok(st.ledger.some(l => l.kind === 'flat' && l.subId === ns.id && Math.abs(l.fee - 1.125) < 1e-6), 'flat fee line missing or ≠1.5%');
  // ADVERSARIAL: pct brief with kill=0 → approved video never pays, never kills
  await advance(20);
  st = await S(); ok(st.subs.find(s => s.id === ns.id).status === 'approved', 'flat approved video changed status: ' + st.subs.find(s => s.id === ns.id).status);

  section('P3 adversarial: brief validation + pct brief with kill 0');
  await nav('New brief');
  await page.fill('#nb-product', 'No markets'); await page.fill('#nb-hooks', 'a\nb'); await page.click('button:has-text("Publish brief")'); await page.waitForTimeout(60);
  st = await S(); ok(!st.briefs.some(b => b.product === 'No markets'), 'brief created with no markets');
  await page.fill('#nb-product', 'One hook'); await page.fill('#nb-hooks', 'only one'); await page.click('#nb-mk-US'); await page.click('button:has-text("Publish brief")'); await page.waitForTimeout(60);
  st = await S(); ok(!st.briefs.some(b => b.product === 'One hook'), 'brief created with one hook');
  // pct rule + kill 0: the "approved means paid" promise has a hole
  await nav('New brief');
  await page.fill('#nb-product', 'Pct no kill'); await page.fill('#nb-hooks', 'a\nb'); await page.click('#nb-mk-US'); await page.selectOption('#nb-rtype', 'pct'); await page.fill('#nb-kill', '0');
  await page.click('button:has-text("Publish brief")'); await page.waitForTimeout(60);
  st = await S(); const pk = st.briefs.find(b => b.product === 'Pct no kill');
  ok(!pk || pk.rule.kill > 0, 'ADVERSARIAL: % rule accepted with kill fee 0 — an approved video can be shelved forever with no pay (promise #2 hole)');

  section('P3 adversarial: rejected items vanish from brand side');
  await fresh(); await role('Brand'); await nav('Submissions');
  // 2026-10-29 amended: Reject requires a reason (creator HIGH); an unreasoned click must be refused
  await page.locator('.panel:has-text("sofia_fees_mx") button:has-text("Reject")').click(); await page.waitForTimeout(60);
  st = await S(); ok(st.subs.find(s => s.id === 's3').status === 'review', 'reject went through with no reason');
  await page.selectOption('#rj-s3', { index: 1 }); await page.locator('.panel:has-text("sofia_fees_mx") button:has-text("Reject")').click(); await page.waitForTimeout(60);
  st = await S(); ok(st.subs.find(s => s.id === 's3').status === 'rejected' && st.subs.find(s => s.id === 's3').note.startsWith('Off brief'), 'reject reason not recorded: ' + st.subs.find(s => s.id === 's3').note);
  let allBrand = '';
  for (const v of ['Briefs', 'Submissions', 'Launch', 'Ledger', 'History']) { await nav(v); allBrand += await text(); }
  ok(allBrand.includes('sofia_fees_mx'), 'rejected video has no brand-side history (vanishes from every brand view)');

  section('P4 persistence');
  await fresh(); await advance(3); await page.reload(); await page.waitForTimeout(150);
  st = await S(); ok(st.day === 3, 'reload lost day: ' + st.day);
  await page.click('nav >> text="Reset example data"'); await page.waitForTimeout(60);
  st = await S(); ok(st.day === 0, 'reset did not return to day 0');

  section('P4 layout at phone width');
  const mp = await ctx.newPage(); await mp.setViewportSize({ width: 400, height: 800 }); await mp.goto(url); await mp.waitForTimeout(150);
  for (const v of ['Briefs', 'Submissions', 'Launch', 'Ledger', 'History', 'New brief']) {
    await mp.click(`nav >> text="${v}"`); await mp.waitForTimeout(60);
    const sw = await mp.evaluate(() => document.documentElement.scrollWidth);
    ok(sw <= 400, `phone overflow on ${v}: scrollWidth ${sw}`);
  }
  await mp.click('#roleCreator'); for (const v of ['Brief feed', 'My submissions', 'Earnings', 'Ledger']) { await mp.click(`nav >> text="${v}"`); await mp.waitForTimeout(60); const sw = await mp.evaluate(() => document.documentElement.scrollWidth); ok(sw <= 400, `phone overflow on ${v}: ${sw}`); }
  await mp.close();

  section('P4 static sweep: status vocabulary rendered');
  const statuses = [...src.matchAll(/status\s*[:=]\s*"([a-z]+)"/g)].map(m => m[1]);
  const uniq = [...new Set(statuses)];
  const pillMap = src.match(/const m=\{([^}]+)\}/)[1];
  for (const s of uniq) ok(pillMap.includes(s + ':'), 'status "' + s + '" has no pill rendering');
  // recorded-but-never-shown: fields set but never read in a view
  for (const f of ['approval', 'dailyBudget', 'adId', 'killPaid', 'flatPaid', 'open']) ok((src.match(new RegExp('\\.' + f + '\\b', 'g')) || []).length >= 2, 'field ' + f + ' recorded but never read');
  const canCloseBrief = /open\s*=\s*false|open=!b\.open|toggleBrief/.test(src);
  ok(canCloseBrief, 'brief.open is seeded but no UI can close or reopen a brief');

  // ---------- Landing ----------
  section('L1 landing: calculator + ticker + waitlist');
  const lp = await ctx.newPage(); const lerrs = [];
  lp.on('pageerror', e => lerrs.push(e.message));
  await lp.goto('file://' + LANDING); await lp.waitForTimeout(200);
  await lp.evaluate(() => { const s = document.getElementById('spend'); s.value = 200000; s.dispatchEvent(new Event('input')); const r = document.getElementById('rate'); r.value = 12; r.dispatchEvent(new Event('input')); });
  const o = await lp.evaluate(() => ({ c: document.getElementById('oCreators').textContent, u: document.getElementById('oUs').textContent, t: document.getElementById('oThem').textContent, d: document.getElementById('oDiff').textContent }));
  ok(o.c === '$24,000' && o.u === '$2,000' && o.t === '$2,500' && o.d === '$500', 'calculator: ' + JSON.stringify(o));
  await lp.waitForTimeout(9000);
  const rows = await lp.evaluate(() => document.querySelectorAll('#lrows tr').length);
  ok(rows <= 5 && rows >= 4, 'ticker rows: ' + rows);
  await lp.fill('#wlEmail', 'e@x.com'); await lp.click('#wl button'); await lp.waitForTimeout(60);
  ok((await lp.textContent('#wlMsg')).includes('e@x.com'), 'waitlist confirmation missing');
  const lsw = await lp.evaluate(() => document.documentElement.scrollWidth); ok(lsw <= 1280, 'landing desktop overflow');
  await lp.setViewportSize({ width: 400, height: 800 }); await lp.waitForTimeout(100);
  const lsw2 = await lp.evaluate(() => document.documentElement.scrollWidth); ok(lsw2 <= 400, 'landing phone overflow: ' + lsw2);
  ok(lerrs.length === 0, 'landing errors: ' + lerrs.join('|'));
  // every nav anchor resolves
  const anchors = await lp.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(h => h && !document.getElementById(h)));
  ok(anchors.length === 0, 'dangling anchors: ' + anchors);
  await lp.close();

  await browser.close();
  if (F.length) { console.error('FINDINGS (' + F.length + '):\n  - ' + F.join('\n  - ')); process.exit(1); }
  console.log('ALL PASS');
})().catch(e => { console.error('HARNESS CRASH', e); process.exit(2); });
