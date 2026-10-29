# Residual — gauntlet review v1 (2026-10-29)

## §0 Verdict

The core loop holds: gate → approve → run → spend sync → weekly payout conserves money (creator value = paid + owed, payout entries = paid) over a 70-day soak with no page errors, the $400 cap holds, the fee is 1.0% of every spend line, and the page works at 400px. The first run found 5 harness findings and the critic panel found 8 confirmed defects, three of them breaking promise #2 (approved means paid). All 13 are fixed and covered by a battery; the build is **CERTIFIED** on 17 batteries. Scope: Standard. Specimen: `src/app.html` and `src/landing.html` (the artifact bodies), tested as the wrapped standalone build `scripts/build.sh` produces, which is byte-identical inside `<body>`.

## Method

Phase 1–3 ran as a Playwright harness driving the real page through public inputs only (`harness-residual.js`, 17 batteries). Phase 4 static sweep in the same file. Phase 5 personas ran as a 4-critic / 24-skeptic Workflow (media buyer, Colombian creator, LATAM compliance lead, design critic); every finding was adversarially verified against the live file before it counted.

Capability map: state root `S` (localStorage key `residual-v1`); tick `advanceDay()` (one call = one day; spend sync, kill clock, weekly payout); input seam = DOM only (no keyboard verbs); entities `S.briefs`, `S.subs` (status vocabulary: review, revise, approved, running, paused, killed, rejected), `S.ledger` (kinds spend, flat, kill, payout); persistence `save()`/reset; headless viability: real Chromium, fonts blocked by the proxy (cosmetic only).

Evidence ceiling:

| Tool | Proves | Blind to |
| --- | --- | --- |
| Playwright harness | gate, clock, payout, cap, fee, persistence, layout width | taste, whether the model is right for real ad accounts |
| Static sweep | every status has a pill; recorded fields are read somewhere | runtime behaviour |
| Critic panel | promise-vs-code gaps, first-five-minutes friction | anything the critics did not think of |
| Owner's eyes | whether it feels like a product | nothing, but expensive |

## Findings and what landed

| # | Tier | Finding | Who notices, when | Fix landed | Battery |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Kill fee could be $0 on a % rule; approved video shelved forever, clock counts negative | Any creator, first ten minutes | `KILL_FLOOR` $10 enforced on % rules; flat rules show "paid on approval"; s6 seeded with its $75 | P3 adversarial, P1 journey |
| 2 | HIGH | Launch-then-pause (or $0 budget) stopped the 14-day clock with zero spend | Creator, the first time a brand games it | Clock keys on spend: killed unless ≥ $50 spent in 14 days, regardless of status; audit line "kill fee triggered" | P2 run-or-pay clock |
| 3 | HIGH | One scalar ad ID per video; a real creative runs in 4–8 ad sets | Media buyer, minute 3 on Launch | `s.ads[]` of {platform, adId, set}; one ledger line per ad ID per day; "+Meta/+TikTok/+Google" attaches more | P2 many ad IDs |
| 4 | HIGH | Feed showed the first market's checklist whatever market was picked | Creator picking MX on a CO/MX brief | All markets' lists rendered, labelled | P2 flat rule (new sub carries 4 items) |
| 5 | HIGH | Feed monthly estimate ignored the per-video cap | Creator on the Nimbus brief | min(estimate, cap) with "reached in ~N days" | — (copy; eyeball) |
| 6 | HIGH | Reject was one click with a canned, impossible reason | Rejected creator | Reason required from a fixed list; refused without one; reason shown to creator and logged | P3 rejected items |
| 7 | HIGH | Re-submit kept old ticks and left no trace | Compliance lead | New cut re-checked from scratch, file versioned `_v2`, audit line | P2 gate law |
| 8 | HIGH | Checklist was a market constant with gambling legends on a fintech brief | Compliance lead | Market base + vertical items (consumer/fintech/gambling), snapshotted per submission | P2 gate law |
| 9 | MEDIUM | "Kill fee paid" shown while only owed, dated before the kill | Brand on Launch | "pays <next payout>" until covered | P2 kill-fee law |
| 10 | MEDIUM | Revise named only the first unticked item | Creator | Names every unticked item | P2 gate law |
| 11 | MEDIUM | Rejected and killed videos vanished from every brand view; no decision log | Brand, compliance | History view: rejected/killed table + decision log with reviewer, date, ticks, unticked item names | P3 rejected items |
| 12 | MEDIUM | Audit "who" hardcoded; pause/resume unlogged | Compliance lead | Reviewer name field in the rail; pause/resume/launch/kill all logged | P2 run-or-pay clock |
| 13 | MEDIUM | Seeded flat+pct video never received its flat fee; payout cadence seeded as 8 days then 7 | Anyone reading the ledger | Flat fee seeded with its ledger line; last payout seeded at day −6 so Friday is next | P1 journey, P2 payout law |
| 14 | MEDIUM | Brand Ledger said "creators see the same lines" but creators had no ledger | Creator | Creator Ledger view (same lines, filtered) | P1 journey |
| 15 | MEDIUM | Hero said "1.0% and nothing else" while flat pay is 1.5% | Anyone reading pricing | Hero fine print corrected | L1 |
| 16 | MEDIUM | No way to close or reopen a brief | Brand | Close/Reopen on each brief card | P4 static sweep |
| 17 | MEDIUM | Opening screen titled Programs under a nav called Briefs, with an unexplained simulation control | Stranger, first 10 seconds | Heading matches nav, counts computed, one line explains Advance one day | — (copy; eyeball) |

Refuted or already-fixed-in-flight: 16 panel findings were refuted by the skeptics, almost all because the fix had landed between critique and verification (the panel read the live file). Two genuine refutations: "seedHistory never sets flatPaid for s4" (it does, after fix 13) and "the cap is undefined as lifetime vs monthly" (the feed now says lifetime).

Deferred with reason: real ad-account OAuth, Partnership/Spark permission flow and Stripe Connect are out of the prototype's stated scope; the data model now supports them (ads per video, ledger per ad ID).

## Certification

| Battery | Result | Rerun / new |
| --- | --- | --- |
| P0 specimen | PASS | rerun |
| P1 journey (9 views, both roles, seed integrity) | PASS | rerun + creator ledger |
| P2 gate law (locked at 0/4 and 2/4, revise names all, resubmit resets, approve at 4/4) | PASS | amended 2026-10-29 |
| P2 kill-fee law (s2 at day 11, s3 at day 14, flat never) | PASS | rerun |
| P2 payout law (weekly, conservation, payout = paid) | PASS | rerun |
| P2 cap + fee (70-day soak, $400 cap, 1%) | PASS | rerun |
| P2 launch + ad ID, pause/resume | PASS | rerun |
| P2 many ad IDs per video | PASS | new |
| P2 run-or-pay clock keys on spend | PASS | new |
| P2 flat rule on approval (fee 1.5%) | PASS | amended |
| P3 brief validation + kill-fee floor | PASS | amended |
| P3 reject requires a reason; history keeps it | PASS | amended |
| P4 persistence + reset | PASS | rerun |
| P4 phone width, 10 views | PASS | rerun |
| P4 static sweep (status pills, recorded fields read, brief toggle) | PASS | rerun |
| L1 landing (calculator, ticker, waitlist, anchors, widths) | PASS | rerun |

`bash scripts/gauntlet.sh` → `ALL PASS`.

## Persona quotes (anchored)

- Media buyer: "One ad ID per video is not how an account works." (#3)
- Creator: "Approved and then paused with nothing spent is exactly the Trybe move." (#2) · "Tell me the cap before I film." (#5)
- Compliance: "A re-submitted cut with the old ticks is not a review." (#7) · "Why is there a gambling legend on a remittance app?" (#8)
- Design critic: "The whole argument only appears after the clock moves and nothing tells me to move it." (#17)

## Scorecard

Boot-to-play B · Promise integrity A− (after fixes; was D) · Feedback B+ · Fairness & mercy A− · Persistence A · Robustness A (70-day soak clean) · Convention fit B (Trybe grammar kept: brief → submit → approve → launch; deviations are the wedge) · First five minutes B−.

## OPPORTUNITIES (ranked by impact ÷ effort)

1. **Guided first run** (design): a "Play the loop" button that walks approve → launch → advance → Friday payout. One-session build. ← the single best next build.
2. **Brand track record on feed cards** (creator): % of approvals launched, median days to launch, kill fees paid, median review time. Half the data already exists in `audit`.
3. **Review SLA clock** (creator): "In review" has no time bound; 5 days then escalate or a hold fee.
4. **Ledger reconciliation + export** (media buyer): per-ad-account CSV with account currency and FX; nightly diff vs Ads Manager including restatements.
5. **Per-item evidence** (compliance): each tick anchored to a file version and frame timestamp; audit pack export per video per market.
6. **Separation of duties + rule bank** (compliance): a compliance sign-off step after marketing approval; any flagged item auto-added to the market checklist. Mirrors Eric's own self-improving compliance sweep.
7. **Agency workspace** (design): the landing sells a $199 tier the app does not show.
8. **Dispute flag per ledger line** (design, creator).

Prediction to check at the next audit: the first three asks will be (a) connect a real Meta ad account, (b) the guided first run, (c) brand track record on the feed.

## Owner's eyeball list

- Feed card estimate copy with the cap clause (#5).
- Launch table at phone width with two ad IDs on a video.
- History view's "unticked:" line when a long checklist is half-ticked.
- Whether "Residual" and the three-dot mark read as a product name to someone who has never heard of Trybe.
