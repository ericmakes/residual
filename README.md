# Residual

Performance UGC for performance marketers. A concept competitor to [Trybe](https://jointrybe.com/): creators earn a residual on every dollar of ad spend their video runs on, across Meta, TikTok and Google, with the spend ledger open to both sides.

The wedge Trybe cannot take without rebuilding: attribution on **ad-platform spend by ad ID**, not Shopify GMV. That makes any advertiser with an ad account a customer (apps, SaaS, fintech, regulated verticals) and makes creator pay verifiable to the cent.

Five promises, each mapped to a Trybe gap:

1. **Open ledger.** Daily spend by ad ID, visible to brand and creator.
2. **Approved means paid.** Approval starts a 14-day run-or-pay clock; the clock keys on real spend (min $50), so launch-then-pause does not stop it. Kill fee floor $10 on any % rule.
3. **Pooled creators.** A brief goes live to matching creators in minutes.
4. **Compliance gate.** Per-market base checklist + per-vertical items, snapshotted on each submission; Approve stays locked until every item is ticked; Revise names every unticked item; every decision is logged with reviewer, time and the checklist state.
5. **Many briefs, agency workspaces.** One program, many pay rules.

Pricing: free to start; 1.0% of ad spend on % rules, capped at $5,000/brand/mo (Trybe: 1.25%, uncapped); 1.5% on flat creator pay; 0% on kill fees; compliance desk $25/video or $750/mo per market; agency workspace $199/mo. Unit economics in `docs/teardown.md`: ~78% gross margin, break-even near $4M/mo of spend.

## What is here

| Path | What |
| --- | --- |
| `src/app.html` | The prototype, as published to claude.ai (no doctype; the host adds the skeleton) |
| `src/landing.html` | The landing page, same convention |
| `prototype/index.html`, `landing/index.html` | Standalone builds of the two pages (open in a browser) |
| `scripts/build.sh` | Wraps `src/` into the standalone builds |
| `scripts/gauntlet.sh` | **Certify before ship**: build, then run every saved harness battery. Exit 0 = CERTIFIED |
| `audits/2026-10-29/harness-residual.js` | Playwright harness: 17 batteries, public inputs only |
| `audits/2026-10-29/residual-review-v1.md` | Audit report: harness findings, persona panel, fixes landed, opportunities |
| `docs/teardown.md` | Trybe teardown and product spec (export of the working doc) |

## Run it

```bash
npm i -D playwright        # once; Chromium must be installed for playwright
bash scripts/gauntlet.sh   # build + certify
open prototype/index.html  # or landing/index.html
```

The prototype runs on example data in the browser (localStorage per viewer). **Advance one day** in the sidebar runs the daily spend sync, the kill-fee clock and the weekly payout so the whole loop can be walked end to end. No real ad accounts or Stripe are connected.

## Laws

- Certify before ship: `scripts/gauntlet.sh` green before any publish.
- One piece = one commit with proof (the harness line that covers it).
- Harness contracts are amended with a dated comment, never deleted.
- Taste is Eric's; the machine proves correct.
