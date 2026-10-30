# Residual

Performance UGC for performance marketers. A concept competitor to [Trybe](https://jointrybe.com/): creators earn a residual on every dollar of ad spend their video runs on, across Meta, TikTok and Google, with the spend ledger open to both sides.

The wedge Trybe cannot take without rebuilding: attribution on **ad-platform spend by ad ID**, not Shopify GMV. That makes any advertiser with an ad account a customer (apps, SaaS, fintech, regulated verticals) and makes creator pay verifiable to the cent.

Five promises, each mapped to a Trybe gap:

1. **Open ledger.** Daily spend by ad ID, visible to brand and creator.
2. **Approved means run or returned.** Approval starts a 21-day clock; the brand can withdraw within 48h, after which the clock keys on real spend (min $50), so launch-then-pause does not stop it. An approval that lapses returns the video to the creator and shows on the brand's public track record. No one pays for a video that never ran, and Residual never funds a payout.
3. **Pooled creators.** A brief goes live to matching creators in minutes.
4. **Compliance gate.** Per-market base checklist + per-vertical items, snapshotted on each submission; Approve stays locked until every item is ticked; Revise names every unticked item; every decision is logged with reviewer, time and the checklist state.
5. **Many briefs, agency workspaces.** One program, many pay rules.

Pricing (bootstrapped and brand-favourable: no money leaves Residual before it arrives, and brands are the scarce side): brands pay $0 on their first $10,000 of spend, then 0.75% capped at $5,000/brand/mo, debited weekly alongside creator payouts (Trybe: 1.25% from the first dollar, uncapped); perpetual licence to a video once the creator has earned $250 from it (buyout at 3× trailing 30-day share before that); two free revisions; optional brand-paid kill fee or incentive in kind (swag, merch, platform credit) shown on the brief, no fee. Creators pay 5% of earnings; cross-border and FX at Stripe's cost. Also: 1.5% on flat creator pay; compliance desk $25/video or $750/mo per market (Eric's own labour at first, and the first revenue); agency workspace $199/mo. Unit economics in `docs/teardown.md`: ~92% gross margin, fixed cost ~$150/mo, cash break-even at the first paying brand.

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
