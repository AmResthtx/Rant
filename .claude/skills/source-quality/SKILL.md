---
name: source-quality
description: >
  Content sourcing and quality-vetting skill. Seeks out the highest-quality, most
  authoritative sources on a topic and grades every source BEFORE its content is
  accepted, cited, or used to inform writing or decisions. Distinguishes primary,
  authoritative material (standards bodies, peer-reviewed research, original
  manufacturers, named domain experts, official documentation) from low-quality
  content (SEO marketing pages, content farms, undated rewrites, AI-generated
  filler, unsourced blog spam). Use this skill whenever the user asks Claude to
  research a topic, gather references, "find good sources," fact-check, learn from
  videos or articles, write content that must be accurate, or decide whether a
  source is trustworthy. Triggers automatically before citing any external source
  or incorporating fetched/searched content into a deliverable. When a source
  cannot be verified to TRUSTED or RELIABLE tier, it is quarantined — used for
  leads only, never quoted as fact.
---

# Source Quality v1

A research-integrity skill. Its job is simple to state and hard to do well:
**find the best available content on a topic, and refuse to learn from the rest.**

Most of the open web is optimized to be *found*, not to be *correct*. SEO pages,
content farms, and AI-spun rewrites rank well and load freely, while the primary
sources they paraphrase (standards, research, manufacturer engineering docs) are
often slower, paywalled, or blocked to automated fetches. This skill exists to
invert that bias — to actively seek authority and to gate everything else out
before it contaminates a deliverable.

---

## WHAT THIS SKILL DOES

A **six-phase workflow**:

1. **SOURCE** — Actively seek primary/authoritative material, not just top results
2. **GRADE** — Score each source against the quality rubric BEFORE reading it as fact
3. **CORROBORATE** — Require independent agreement for any load-bearing claim
4. **STRESS-TEST** — Pressure the surviving claims; don't accept what merely reads well
5. **GATE** — Accept / Quarantine / Reject each source by tier
6. **ATTRIBUTE** — Cite what was used, with tier, and flag what was rejected and why

The order matters: **grade before you trust.** A source is vetted on its
provenance and characteristics *before* its claims are absorbed — never after,
when the content has already shaped your thinking.

**Calibrated skepticism, not reflexive doubt.** The goal is to proportion scrutiny to
stakes and evidence — heavy on safety/legal/financial/engineering claims, light on the
trivially verifiable. Skepticism means asking who said it, what they're selling, and
whether anyone independent agrees. It does *not* mean rejecting well-supported facts,
demanding proof of the obvious, or stalling on endless verification. A claim
corroborated across credible independent sources is usable — say so and move.

---

## QUALITY TIERS

| Tier         | What it is                                                                 | How it may be used                        |
|--------------|----------------------------------------------------------------------------|-------------------------------------------|
| TRUSTED      | Primary source: standards bodies, peer-reviewed research, official docs, original manufacturer/inventor, named credentialed experts, raw data | Quote, cite, build on directly            |
| RELIABLE     | Established secondary source with clear authorship, citations, and editorial accountability (reputable trade press, textbooks, university extension, govt agencies) | Cite with light corroboration             |
| MIXED        | Useful but unverified: practitioner blogs, vendor pages with real expertise mixed with sales, single uncredited author | Leads only — corroborate every fact before use |
| LOW          | SEO/content-farm pages, undated rewrites, unsourced listicles, affiliate spam, AI-generated filler | Do not learn from. Discard.               |
| REJECT       | Contradicts primary sources, fabricated citations, demonstrably wrong, hidden agenda | Block. Note the contradiction.            |

**Default posture: a source is MIXED until something earns it a higher tier.**
Ranking high in search results earns *nothing* — that's a popularity signal, not
a quality signal.

---

## PHASE 1 — SOURCE (Seek Authority, Not Results)

Do not accept the first page of search results as "the sources." Deliberately
hunt upstream toward the origin of the knowledge.

**Sourcing moves (in priority order):**

1. **Find the primary source.** Standards (ISO, ASTM, ICC, IEEE, RFCs), peer-reviewed
   papers, official documentation, original manufacturer/inventor material, raw
   datasets, court records, legislation. Ask: *who originally established this fact?*
2. **Identify the domain authorities.** Who literally wrote the book or the standard?
   Named experts, the inventing company, the governing body. Search for them by name.
3. **Use authority-biased queries.** Append terms like `standard`, `specification`,
   `peer reviewed`, `whitepaper`, `documentation`, `filetype:pdf`, or the governing
   body's name. Restrict to authoritative domains when possible (`.gov`, `.edu`,
   standards orgs, the manufacturer).
4. **Trace paraphrases back.** When five blogs say the same thing, find the one
   document they're all paraphrasing and cite *that*.
5. **Prefer dated, attributed, cited material.** No author, no date, no references is
   a quality red flag before you read a single sentence.

**On blocked/paywalled primary sources:** a 403, paywall, or login wall is common
for high-tier material and is *not* a reason to downgrade to whatever loaded freely.
Capture the citation, seek an open mirror (author preprint, cached standard, the
agency's own copy), or report the high-tier source as the reference even if its full
text couldn't be fetched. Never let accessibility silently substitute a LOW source
for a TRUSTED one.

---

## PHASE 2 — GRADE (Before Accepting Content)

Score every source against the rubric **before** treating its content as fact.
Load `references/quality-rubric.md` for the full scorecard. Quick signals:

**Raises tier:**
- Named, credentialed author or recognized institution
- Primary data, original research, or first-party documentation
- Explicit citations to other primary sources
- Publication/revision date present and current
- Editorial accountability (corrections policy, masthead, peer review)
- Specific, falsifiable claims with numbers and conditions

**Lowers tier:**
- No author or a generic "Team"/brand byline, no date
- Claims with no sourcing; round numbers with no provenance
- Sales CTA density high; "content" is a funnel to a product
- Hedge-and-filler prose, restated keywords, AI-slop cadence
- Identical phrasing found across many sites (rewrite farm)
- Statistics with no origin ("studies show", "experts agree")

Grade the *source*, then grade *each claim* you intend to use. A RELIABLE source
can still contain an unsourced load-bearing claim that must be corroborated.

---

## PHASE 3 — CORROBORATE

No single source carries a load-bearing claim into a deliverable on its own.

- **TRUSTED primary source** → may stand alone for its own domain of authority.
- **Any non-primary claim** that matters → require **two independent sources** that
  do not derive from each other. Two blogs paraphrasing the same press release count
  as **one** source.
- **Numbers, specs, safety/legal/medical/financial facts** → corroborate against a
  TRUSTED tier source or do not state them as fact.
- **Conflict between sources** → the higher tier wins; surface the disagreement
  rather than silently picking one.

---

## PHASE 4 — STRESS-TEST

Corroboration tells you sources agree; stress-testing tells you whether the claim
actually holds. Don't accept information because it's well-written or intuitive.
Pressure the claims you intend to rely on:

- **Recency:** Is it current, or has it been superseded? Check dates and revisions.
- **Edges:** Does it hold at the boundaries, or only in the happy path? What conditions
  or exceptions does the source omit?
- **Falsification:** What would have to be true for this to be wrong? Look for that.
- **Independence of agreement:** Do the corroborating sources actually reason
  separately, or do they share one upstream origin (so the "agreement" is an echo)?
- **Incentive:** Does the source benefit from the claim being believed? Weight accordingly.
- **Plausibility vs. proof:** Separate "sounds right" from "is shown." Persuasive prose
  is not evidence.

Scale the effort to stakes: a passing sanity check for low-cost claims, real adversarial
pressure for anything safety-, legal-, financial-, or engineering-critical. Claims that
survive are usable; claims that only *sound* good get downgraded or dropped.

## PHASE 5 — GATE (Accept / Quarantine / Reject)

Each source exits the pipeline through exactly one gate:

| Gate        | Applies to        | Effect                                                       |
|-------------|-------------------|-------------------------------------------------------------|
| ACCEPT      | TRUSTED, RELIABLE | Usable as cited fact (RELIABLE with corroboration)          |
| QUARANTINE  | MIXED             | Leads and direction only; every fact must be re-sourced before use |
| REJECT      | LOW, REJECT       | Not used. Briefly note why, so the reasoning is auditable.  |

**Quarantine is the default for the open web.** Content in quarantine can suggest
what to go verify; it can never be the thing cited. This is what "understanding the
difference before accepting it" means operationally — the gate happens before the
content informs the output, not after.

---

## PHASE 6 — ATTRIBUTE

Every deliverable that used external content reports its sourcing:

```
SOURCES USED
- [Title / org] — TIER — why it qualifies — URL
  (note if primary text was blocked/paywalled and how it was handled)

CORROBORATION
- [Load-bearing claim] — confirmed by [source A] + [source B]

REJECTED / QUARANTINED
- [Source] — tier — one-line reason it wasn't used as fact
```

Transparency about what was *thrown out* is as important as what was kept — it lets
the user audit the quality judgment instead of trusting it blindly.

---

## VIDEO & MULTIMEDIA CONTENT

Video ranks and autoplays on engagement, not accuracy — grade it harder.

**Raises a video's tier:** manufacturer/standards-body channel, named credentialed
presenter, original install/test/lab footage, content that shows methodology and
numbers, references to standards on screen.

**Lowers it:** repair-company ad reels, faceless voiceover-over-stock-footage,
unsourced "explainer" channels, anything that's a sales funnel with a thumbnail.

Treat a manufacturer's engineering demo or a credentialed practitioner's recorded
load test as RELIABLE; treat a generic contractor ad as MIXED at best. Transcripts
and on-screen claims get the same Phase 2/3 grading as text. Prefer the
manufacturer's or standards body's own channel over aggregators.

---

## OPERATING RULES

1. **Grade before you trust.** Provenance is judged before content is absorbed.
2. **Search rank is not quality.** Findability ≠ correctness.
3. **Default tier is MIXED.** Authority must be earned, not assumed.
4. **Blocked ≠ downgrade.** A paywalled primary beats a free content farm.
5. **Load-bearing claims need corroboration** unless from a TRUSTED primary.
6. **Trace paraphrases to the origin** and cite the origin.
7. **Higher tier wins conflicts**, and the conflict is surfaced, not hidden.
8. **Report what was rejected**, not just what was used.
9. **Numbers, safety, legal, medical, financial → TRUSTED tier or not stated.**
10. **No author, no date, no citations = red flag before reading.**
11. **Skeptical, not unreasonable.** Scrutiny scales to stakes; corroborated facts are usable.
12. **Stress-test before relying.** Sounds-good is not is-shown.
13. **Stay current and self-correct.** Prefer current research; when better-sourced
    information contradicts what was used before, update and say what changed.

---

## AUTO-TRIGGER CONDITIONS

- User asks to research a topic, gather sources, or "find good/reliable sources"
- About to cite or quote an external source in a deliverable
- About to incorporate fetched/searched/video content into writing or a decision
- User asks "is this source trustworthy / accurate / any good?"
- Fact-checking, or writing content that must be accurate
- A high-tier source returns 403/paywall and a free lower-tier alternative exists
- Multiple sources disagree on a load-bearing fact
- Stating a number, spec, or safety/legal/medical/financial fact a decision rests on
- Relying on a technical claim that "sounds right" but hasn't been independently checked
- Reusing a previously gathered fact after time has passed or stakes have risen

These principles also apply as a standing posture even when the skill isn't formally
invoked — see the project `CLAUDE.md` operating principles. The skill is the detailed
procedure; the posture is always on.

---

## REFERENCE FILES

- `references/quality-rubric.md` — Full scorecard, signal checklists, worked examples
- `references/sourcing-playbook.md` — Authority-biased search strategies by domain,
  handling blocked sources, tracing paraphrases to primary material
- `references/verification-and-skepticism.md` — Calibrated-skepticism dial, the
  stress-test questions, and continuous-improvement / self-correction practice

Read `quality-rubric.md` before Phase 2. Read `sourcing-playbook.md` before Phase 1
when the topic is unfamiliar or the first search pass returns mostly MIXED/LOW sources.
Read `verification-and-skepticism.md` before Phase 4 for high-stakes claims or when
sources agree suspiciously cleanly.
