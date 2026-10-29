# Trybe Competitor — Teardown & Product Spec

29 Oct 2026 · Eric Barker. Living copy: the Claude doc of the same name; this file is the export committed with the repo.

## What Trybe is

[Trybe](https://jointrybe.com/) is software for running a brand's own creator program: brands recruit creators, send a brief, approve submitted videos, pay creators on performance, and launch the approved videos as Meta Partnership (whitelisted) Ads. It is free to start and takes a small cut of whatever flows through it. The stack is Shopify + Meta; TikTok appears only in its terms, not as a product surface.

| | Trybe today | Source |
| --- | --- | --- |
| Brand fee | 1.5% of attributed sales, or 1.25% of ad spend, or 1.5% of flat creator pay; never stacked; no seats, contracts or minimums | [jointrybe.com](https://jointrybe.com/) |
| How creators are paid | % of sales (72% of 6,148 brands, median 12%), % of ad spend (500 brands, median 10%), flat fee per approved video (527 brands, median $50), or fixed $ per order | [TrybeDaily snapshot, 7 Oct 2026](https://trybedaily.com/blog/how-much-do-trybe-creators-make) |
| Payout cadence | Weekly for 4,835 of 5,021 brands that state one; via Stripe, 170+ countries | [TrybeDaily](https://trybedaily.com/blog/how-much-do-trybe-creators-make), [jointrybe.com](https://jointrybe.com/) |
| Ad channels | Meta Partnership Ads from approved submissions; one-click launch | [jointrybe.com](https://jointrybe.com/) |
| Commerce | Shopify sync for products, orders, samples; server-side last-click attribution | [jointrybe.com](https://jointrybe.com/) |
| Creator sourcing | Brand-run: Discovery filters + 10–12 invite credits a day; 2–4 weeks from setup to first video | [Foxwell Digital guide](https://www.foxwelldigital.com/blog/a-creative-strategists-guide-to-trybe-sourcing-creator-videos-for-brands-and-agencies) |
| Rights | Creator keeps ownership; brand gets a non-exclusive licence that ends when commission payments stop (ads down within 5 business days) | [Influee comparison](https://influee.co/blog/trybe-alternatives) |

Proof points it leads with: Final Boss Sour Meta-attributed revenue $300K to $2.1M/mo and CPA $35 to $20 in 6 months; KIAURA $350K to $2.1M/mo. Creator count and total payouts are not published.

## Where Trybe falls short

The model is sound; the gaps are in who it serves and what creators can see. Every gap below is something a competitor can turn into a feature on day one.

| Gap | What happens today | Who feels it | Source |
| --- | --- | --- | --- |
| Shopify + Meta only | Attribution is Shopify GMV or Meta spend; no TikTok Ads, Google/YouTube, or app-install attribution | Apps, SaaS, fintech, regulated advertisers, anyone not on Shopify | [jointrybe.com](https://jointrybe.com/), [Hubfluence](https://www.hubfluence.io/blog/trybe-review-alternative) |
| Approved does not mean paid | A brand can approve a video and never run it; commission-only creators earn nothing | Creators | [Oink tutorial](https://oinkforinfluencers.com/trybe-tutorial-2026/) |
| Opaque ad-spend pay | Creators on % of ad spend cannot see the spend their video is driving; they trust the statement | Creators | [Oink tutorial](https://oinkforinfluencers.com/trybe-tutorial-2026/) |
| Slow cold start | Brand must recruit its own pool: 10–12 invites a day, 2–4 weeks to first video, rejections give no reason | Brands needing creative this month | [Foxwell Digital](https://www.foxwelldigital.com/blog/a-creative-strategists-guide-to-trybe-sourcing-creator-videos-for-brands-and-agencies) |
| Saturated programs | Cuts Clothing: ~3,200 accepted creators, 7,300 submissions; applications "sit there for weeks" | New creators | [Oink tutorial](https://oinkforinfluencers.com/trybe-tutorial-2026/) |
| One brief per program | A new product or pay model means a new program; retainers are awkward for agencies | Agencies, multi-SKU brands | [Foxwell Digital](https://www.foxwelldigital.com/blog/a-creative-strategists-guide-to-trybe-sourcing-creator-videos-for-brands-and-agencies) |
| Licence dies with payments | Non-exclusive licence ends when commissions stop; ads must come down in 5 business days | Brands with winning ads | [Influee](https://influee.co/blog/trybe-alternatives) |
| No compliance layer | Approval is approve/revise/reject with no disclosure or legal checklist per market | Regulated and multi-market advertisers | [jointrybe.com](https://jointrybe.com/) |
| Fee grows with scale | 1.5% of GMV is a few hundred dollars at $20K/mo and several thousand at $500K/mo | 8-figure brands | [Hubfluence](https://www.hubfluence.io/blog/trybe-review-alternative) |

The three that matter most are the first three: Trybe cannot sell to advertisers who are not Shopify DTC brands, and its creator side runs on trust rather than a ledger.

## The competitor: Residual

**Residual** pays creators a residual on every dollar of ad spend their video runs on, across Meta, TikTok and Google, with the spend ledger open to the creator. The tagline: *Your video runs, you get paid. Every day it runs.*

The wedge is the one Trybe structurally cannot take without rebuilding: attribution on **ad spend pulled from the ad platforms by ad ID**, not Shopify GMV. That makes any advertiser with an ad account a customer (apps, SaaS, fintech, marketplaces, regulated verticals) and makes creator pay verifiable to the cent.

Five promises that map one-to-one onto Trybe's gaps:

1. **Open ledger.** Each approved video is tied to one or more ad IDs; daily spend by ad ID syncs from the Meta, TikTok and Google APIs into a ledger both sides see. Creator pay is a % of that number.
2. **Approved means paid.** Approving a video starts a 21-day clock keyed on real spend: unless at least $50 has run on the video, Residual pays the creator a $10 kill fee from its own fee (brands may add a top-up). The brand may withdraw within 48 hours; after that, launch-then-pause does not stop the clock. No liability on the brand for approving.
3. **Pooled creators, not a cold start.** One shared, vetted creator marketplace. A brief goes live to matching creators in minutes; first submissions in days, not 2–4 weeks.
4. **Compliance gate built in.** Per-market base checklist plus per-vertical items (consumer, fintech, gambling), snapshotted onto each submission. Approve stays locked until every item is ticked; Revise names every unticked item; every decision is logged with reviewer, date and the checklist state.
5. **Multi-brief programs and agency workspaces.** One program, many briefs and pay rules; agencies manage several brands from one seat with their own margin on top.

Positioning line for the landing page: *Trybe for everyone who isn't a Shopify store.* Internally the line is sharper: performance UGC for performance marketers.

## Product spec

Residual is one loop: a brief goes out to the pool, a video comes back, it passes a compliance gate, it runs as an ad, the spend it runs on is synced daily, and the creator is paid a share of that spend every week. Everything else is tooling around that loop.

Core loop (drawn in the living doc): Brief goes live → Creator submits → Compliance gate? (fail: revise, naming the items) → Approved, 21-day clock starts → Run as ad (Meta · TikTok · Google; run to ≥ $50 within 21 days or the kill fee pays out) → Spend syncs daily by ad ID → Open ledger, both sides → Weekly payout, % of spend, via Stripe.

**Brand side**

- Program with many briefs. A brief = product, vertical, angle list (3–10 hooks creators pick from), pay rule, markets, do/don't list.
- Pay rules per brief: % of ad spend (default 10%), flat per approved video, or flat + %; optional lifetime cap per video; kill fee top-up (optional; Residual funds the $10 base).
- Submissions inbox with approve, revise (names every unticked checklist item), reject (reason from a fixed list, shown to the creator).
- Compliance checklist per market and vertical, snapshotted per submission. Reviewer ticks each; a video cannot be approved with an unticked item.
- Launch: connect Meta, TikTok and Google ad accounts; attach one or more ad IDs to an approved video (a creative usually runs in several ad sets); one ledger line per ad ID per day.
- Ledger: daily spend by ad ID per video, creator share accrued, platform fee, kill fees due. History: rejected and killed videos plus the decision log.

**Creator side**

- Profile with up to 5 portfolio videos, markets, languages, verticals, approval rate.
- Brief feed filtered to what matches; see the pay rule, the cap, and every market's checklist before filming.
- Submit, see status, see the exact checklist items on a revise; re-submit a new cut (versioned, re-checked from scratch).
- Earnings page: per video, yesterday's spend, share earned to date, next payout date, kill fees received. Ledger: the same lines the brand sees, filtered to your videos. Weekly payout through Stripe Connect.

**Attribution model**

- Spend-based, not sales-based: the ad platform's reported spend for the ad IDs tied to a video is the source of truth. No pixel, no Shopify, no last-click argument.
- Brands that also want sales can add a tracking ID to the landing URL and import revenue, but pay rules on spend never depend on it.

**MVP (what the prototype covers)**

- [x] Brand: create a brief with a pay rule, vertical and checklist
- [x] Creator: claim, submit, get a revise or approve; re-submit
- [x] Compliance gate blocks approval until the checklist is complete; decision log
- [x] Launch attaches ad IDs; a simulated daily spend sync fills the ledger per ad ID
- [x] Kill-fee clock keyed on spend; kill-fee floor
- [x] Earnings page, creator ledger and payout ledger
- [ ] Not in MVP: real OAuth to Meta/TikTok/Google, Partnership/Spark permission flow, Stripe Connect, agency workspaces, AI tagging

## Pricing and unit economics

Brands are the scarce side of this market (Trybe has thousands of creators per brand), so the terms lean toward brands wherever that does not break the creator's deal: a brand's first $25,000 of spend carries no platform fee (the first brief is a free test), then 0.75% against Trybe's 1.25%; approving costs the brand nothing because Residual funds the $10 kill fee itself; a perpetual licence vests once the creator has earned $250 from a video; ten submissions in seven days or the month is free; two free revisions; a 48-hour withdrawal window. The weight moves to the abundant side: creators pay 5% of earnings. The spend-keyed kill clock stays, because it is the reason creators choose Residual, but it is now Residual's promise rather than the brand's liability.

| | Residual | Trybe |
| --- | --- | --- |
| Start | Free; no seats, contracts or minimums | Free; same |
| Brand fee on ad-spend pay rules | **$0 on the brand's first $25,000 of spend, then 0.75%**, capped at $5,000 per brand per month | 1.25% from the first dollar, uncapped |
| Creator fee | 5% of earnings; nothing on kill fees (Collabstr 15%, JoinBrands 20%) | 0% |
| Kill fee | $10 paid **by Residual** after 21 days if an approved video has not run to $50 of spend; brand owes nothing and may add a top-up; 48h withdrawal window | Not a feature |
| Rights | Perpetual paid + organic licence once the creator has earned $250 from the video; buyout at 3× trailing 30-day share before that | Licence ends when commissions stop; ads down within 5 business days |
| Speed guarantee | 10 submissions within 7 days of a brief going live, or that month's fee is waived | None; 2–4 weeks to first video |
| Revisions | Two per video at no charge | Set per campaign |
| Founding cohort | 50 brands: no platform fee for six months, then 0.75% locked for 24 months | — |
| Fee on flat creator pay | 1.5% of creator earnings | 1.5% |
| Fee on sales-based pay rules | 1.5% of attributed sales (optional add-on) | 1.5% |
| Kill fees | 0% fee; passed through to the creator in full | Not a feature |
| Compliance desk (optional) | $25 per video reviewed by a Residual reviewer against the market rule bank, or $750/mo per market unlimited | Not offered |
| Instant payout (optional, creators) | Stripe's instant-payout cost passed through at no markup; weekly stays free | Weekly only |
| Agency workspace | $199/mo per agency: unlimited brands, agency margin on top, white-label creator comms | Retainers run through brand accounts |

Worked example at Trybe's median rule (10% of ad spend) on a brand spending $50,000/mo through creator videos: creators earn $5,000 and keep $4,750, the brand pays Residual $375 at steady state (and nothing for its first $25,000 of spend) where Trybe would charge $625 from the first dollar. At $500,000/mo the gap is $2,500/mo; past that the cap holds Residual at $5,000 while Trybe keeps climbing, which is the number the sales deck leads with for 8-figure brands.

Unit economics per $1,000,000/mo of ad spend through the ledger at the 10% median rule:

| Line | Per $1M/mo of spend |
| --- | --- |
| Revenue (about $7,000 brand fee at 0.75% net of free tiers + $5,000 creator fee at 5% of $100,000) | $12,000 |
| Residual-funded kill fees (about 20 unrun approvals × $10) and speed-guarantee waivers | −$350 |
| Stripe Connect payouts on the $100,000 creator share (0.25% + $0.25 × ~800 weekly payouts) | −$450 |
| Cross-border payouts for LATAM creators, absorbed | −$600 |
| FX passed at Stripe's rate, absorbed | −$600 |
| Brand collection by bank debit (cards carry a 3% surcharge) | −$100 |
| API and infra | −$300 |
| Fraud and chargeback reserve | −$100 |
| Gross margin | about $9,500 (79%) |

Fixed cost for a two-person team with tooling is about $32,000/mo, so break-even sits near $3.4M/mo of spend through the platform, roughly 70 brands at the $50K example. Everything the brand is given (free tier, funded kill fee, rights, speed guarantee) is paid for by the creator fee, not by margin; upside beyond that comes from the compliance desk (about $6 of reviewer cost per $25 review, 75% margin) and the agency tier, neither of which Trybe sells.

## Go-to-market

Sell to the buyer Trybe ignores: the in-house or agency performance marketer who already runs Meta, TikTok and Google and needs creative volume without a Shopify store. The first 50 brands come from three places: app and fintech advertisers in LATAM and ANZ, agencies that buy media across platforms for several clients, and creators already on Trybe who want to see the spend behind their statements.

1. **Founding-brand cohort (Q1 2027).** 50 brands, 1.0% locked for 24 months, hands-on onboarding. Target: $2M/mo of ad spend through the ledger by month 6.
2. **Creator pull.** Recruit creators by publishing the open ledger as the feature: a creator who joins sees daily spend on day one.
3. **Agency tier.** $199/mo workspace with margin on top; one agency brings 5–20 brands at once.
4. **Compliance as the regulated-market wedge.** Per-market checklists make Residual the only UGC platform a compliance team will sign off on for gambling, fintech and alcohol advertisers.

Open question still to settle before building for real: require ad-account OAuth at brief creation (clean ledger) or allow manual spend upload (faster onboarding). The kill-fee question is settled: brand-set with a $10 floor on % rules.

### Sources

- [jointrybe.com](https://jointrybe.com/) (product, fees, case studies)
- [TrybeDaily: How much do Trybe creators make](https://trybedaily.com/blog/how-much-do-trybe-creators-make) (published rate snapshot, 7 Oct 2026)
- [Foxwell Digital: A creative strategist's guide to Trybe](https://www.foxwelldigital.com/blog/a-creative-strategists-guide-to-trybe-sourcing-creator-videos-for-brands-and-agencies)
- [Oink for Influencers: Trybe tutorial 2026](https://oinkforinfluencers.com/trybe-tutorial-2026/) (creator-side experience)
- [Influee: Trybe review and alternatives](https://influee.co/blog/trybe-alternatives) and [Hubfluence: Trybe review](https://www.hubfluence.io/blog/trybe-review-alternative) (competitor comparisons, read as such)
- [Socialync: UGC platform fees compared](https://www.socialync.io/ugc-alternatives) (market fee table, checked 23 Oct 2026)
