# Quality Rubric — Scorecard & Worked Examples

Load this before Phase 2 (GRADE). Use it to assign a tier to a source and to each
load-bearing claim drawn from it. Score the source first, then the claims.

---

## The Scorecard

Score each dimension 0–2. Sum determines the starting tier; signals in the SKILL.md
checklists can then nudge it up or down one band.

| Dimension            | 0 (poor)                              | 1 (partial)                          | 2 (strong)                                   |
|----------------------|---------------------------------------|--------------------------------------|----------------------------------------------|
| **Authorship**       | No author / brand "Team" byline       | Named author, no credentials shown   | Named, credentialed author or institution    |
| **Provenance**       | Paraphrase of unknown origin          | Cites secondary sources              | Primary data / first-party / original research |
| **Citations**        | None                                  | Vague ("studies show")               | Specific, checkable references               |
| **Recency**          | No date                               | Dated but stale for the topic        | Dated and current                            |
| **Accountability**   | Anonymous, no corrections             | Some editorial presence              | Masthead / peer review / corrections policy  |
| **Intent**           | Pure sales funnel                     | Mixed info + sales                   | Inform / document / educate                  |
| **Specificity**      | Vague, hedged, generic                | Some specifics                       | Falsifiable claims with numbers & conditions |

**Banding (out of 14):**
- 12–14 → **TRUSTED** (if also primary) or **RELIABLE**
- 8–11 → **RELIABLE** or strong **MIXED**
- 4–7 → **MIXED**
- 0–3 → **LOW**

A source that contradicts a TRUSTED primary, fabricates citations, or is
demonstrably wrong is **REJECT** regardless of score.

> Note: TRUSTED requires *primary-source character* (you are reading the origin of
> the fact), not merely a high score. A beautifully edited secondary article tops out
> at RELIABLE.

---

## Fast triage signals

If you only have seconds, these usually settle the tier:

**Almost certainly LOW:**
- No author and no date
- Every few sentences restate the title keyword
- Statistics with no source ("up to 90%", "experts agree")
- Heavy CTA density; the article is a doorway to a product
- Exact phrasing appears verbatim on several other sites

**Likely TRUSTED/RELIABLE:**
- A named standard, spec number, or DOI
- A `.gov` / `.edu` / standards-org / inventing-company domain with documentation
- Footnotes or a reference list to other primary material
- Methods, conditions, and numbers you could check or reproduce
- The author is the recognized authority on the topic

---

## Grading individual claims

A source's tier sets a ceiling, not a guarantee. Grade each load-bearing claim:

1. **Is it sourced inside the document?** Follow the citation; grade *that*.
2. **Is it primary to this source?** First-party data from a TRUSTED source can stand.
3. **Is it a number, spec, or safety/legal/medical/financial fact?** → TRUSTED-tier
   corroboration required, or it isn't stated as fact.
4. **Does any independent source confirm it?** Independent = not derived from the same
   origin. Two rewrites of one press release = one source.

---

## Worked examples

**Example A — Standards acceptance criteria (e.g. ICC-ES AC358 for a building product)**
Authorship 2, Provenance 2, Citations 2, Recency 2, Accountability 2, Intent 2,
Specificity 2 → 14 → **TRUSTED**. It defines the rule. May be cited directly and used
to corroborate weaker sources.

**Example B — Original manufacturer / inventor engineering blog**
Named engineers, first-party design data, references to the standard, current date,
but lives on a vendor domain with some product promotion. ~11–12 → **RELIABLE**,
edging TRUSTED for facts that are first-party (their own product's tested values).
Cite with light corroboration; treat their own test data as primary.

**Example C — Local service-company "What is X?" SEO page**
Brand byline, no date, no citations, round numbers, strong CTA, phrasing mirrors a
dozen competitors. 2–4 → **LOW/MIXED**. Useful only to learn how the topic is
*talked about*; never a source of fact. Trace its claims to Example A or B.

**Example D — Peer-reviewed paper, full text behind paywall (403)**
Cannot fetch the body, but DOI, authors, journal, and abstract are available. Tier is
assigned on provenance: **TRUSTED**. Cite it as the reference; seek an open preprint
for the details. Do **not** substitute a free content-farm summary in its place —
note that the primary was inaccessible instead.

**Example E — Faceless YouTube "explainer", stock footage + voiceover, no sources**
No presenter identity, no on-screen references, engagement-optimized. **LOW**.
Compare to a manufacturer's recorded load test with visible methodology and numbers
→ **RELIABLE**.

---

## When everything available is MIXED or LOW

Sometimes no TRUSTED source is reachable. Then:

1. Say so explicitly — do not launder MIXED content into confident fact.
2. Use the best MIXED sources for *direction*, and state claims as reported, not
   established ("according to [vendor], …") with the tier visible.
3. Corroborate across the most independent sources available and flag residual
   uncertainty.
4. Name the primary source that *would* settle it, even if it couldn't be fetched,
   so the user knows where the real answer lives.
