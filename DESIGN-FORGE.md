# Sigil Tactics — The Forge Rework (target design)

> **Status: target spec, not yet built.** This reimagines the game from the
> ground up. The current code (`index.html`, v0.20) still implements the
> *hero-draft* model in `DESIGN.md`. This file is the design we build *toward*;
> `DESIGN.md` stays accurate to the shipped build (and is still the source of
> truth for **card effects**, which this rework reuses unchanged) until the
> rebuild lands.

Decisions locked for v1 (2026-06-17):

- **Growth is per-match.** Units start generic every battle; everything resets
  when the match ends. (A persistent roguelite run is a later layer — out of
  scope for v1.)
- **One deck per player.** Each side draws from its own single deck. v1 is a
  mirror match (both run the same standard decklist), as the paper rules do.
- **One card type — the Sigil.** No Forge/Action split. *Every* card is a single
  class action bearing a class glyph. Casting it resolves its effect **and tucks
  it behind the unit as one level in that class.** Action, levelling, and
  hero-crafting are the same act. (This supersedes the earlier two-card-type and
  equipment-slot drafts in this doc's history.)
- **It must be playable on a table.** Every system survives the tabletop version
  (`paper/rules.md`) — the app *teaches* the paper game, so the two can't
  diverge. See the hard constraint below.

### Hard constraint — tabletop-trackable

No system may require state a human can't track with **cards, dice, and tokens**.
No hidden/accumulating per-unit counters (XP bars, threshold tables); no mid-game
math that can't be pre-tabled. The whole rework obeys this because **a unit's
entire state is the fan of glyph-cards tucked behind it** — you read its level,
its class progress, and its identity by looking at it.

---

## Product & physical pack (v0.2)

**Positioning: an add-on game for _Sorcery: Contested Realm_ players.** They
already own the 5×4 playmat (the board was sized to it from day one), so the
product is *just a pack of cards* that turns their mat into a new tactics game.

**One small pack (~59 cards), no dice, no tokens:**
- **10 Unit cards** — 5 blue + 5 red Recruits (identical; colour = side). Health
  is tracked on this card (wounds, below).
- **2× mirror Sigil deck** — 24 distinct cards (5 classes × 4 + 4 neutral),
  printed twice = 48. Each prints its class glyph + a reminder of that class's
  attune passive, so no separate hero cards are needed.
- **1 rules card.** Total ≈ **59 → one solid pack.**

**Base pack = 5 classes** (the full spectrum): ⚔️ Knight (tank), 🏹 Ranger
(range), 🔮 Mage (AoE), 🗡️ Assassin (flank), 🛡️ Paladin (support). The other four
heroes ship as **expansion packs** that drop new glyphs into the deck — recurring
revenue, each pack stays small.

**No dice — wounds instead.** Life totals are tiny:
- A unit takes **2 wounds** to kill. **Tank** classes (Knight, Paladin) raise that
  to 3, then 4 ascended — their attune payoff.
- A hit deals **1 wound**; **+1 from the rear** (or, for a flank class, the side),
  **+1** for a heavy sigil, **+1** if the target is *vulnerable*. A **guard**
  (shield) absorbs the next wound; a **mend** (heal) removes one.
- Tracking is cardful — rotate / mark the unit card as wounds land; no dice, no
  counters. (A tried variant — "your tucked sigils ARE your toughness" — let
  targets out-tank the small deck and caused stalls; dropped. See below.)

This replaces v0.20's numeric HP/damage (`{4,6,…}` dice, 2–7 damage). The old
`DESIGN.md` card effects no longer apply to the forge pack — **`forge.html` is
authoritative** for shipped values.

---

## Build status — v0.2 prototype (2026-06-17)

`forge.html` implements the full loop end-to-end vs. an AI: 5 Recruits,
auto-deploy, **lowest-level turn order**, **cast-and-tuck** (resolve + level),
**wounds** (no dice), **attunement** → passive + boost + queue-jump, elimination
win + a deck-out backstop. Self-contained, mobile-portrait, no build step. The
shipped v0.20 `index.html` is left untouched; promote `forge.html` to
`index.html` when it's the one you want live.

Validated headlessly (no browser in env) by grinding **300 AI-vs-AI games**: all
decisive, no errors, **~23 turns avg**, win split 138/162 (within mirror
variance), heroes emerge in **289/300** games (~2.7 attuned units of 10 per
game), all 5 classes attuning evenly.

**Key build decisions (resolve open Q #1–2, #5):**
- **Wound scale + 5-class tight pack** per the product plan above; deck = 24/player.
- **Attune threshold = 2** (`ATTUNE`; `ASCEND=4`). 3 left heroes appearing in
  <30 % of games.
- **Toughness is flat** (2, +1/+2 for tank attune) — *not* tied to tuck count. The
  tuck-count version let units out-tank the finite deck and games stalled.
- **Deck-out backstop:** if both decks+hands empty, most-survivors wins —
  guarantees termination.
- **AI funnels** units toward a coherent glyph.

**Implemented card kinds:** dmg, dmg-adj (splash), dmg-vuln, mend (heal), guard
(shield), charge (move), buff (+wound). **Deferred:** terrain; dash/swap/push;
manual deploy (auto-formation for now); campaign (skirmish-vs-AI only); the other
4 classes (expansion packs); a rewrite of `paper/rules.md` to the forge model.

---

## 1. The inversion

The old game was **hero-first**: you drafted heroes, and each hero handed you a
fixed deck. The hero was the input; the cards were baggage.

The new game is **card-first**:

> You deploy **5 generic units** and *inscribe sigils onto them* as you play.
> Each sigil you cast does its thing **and stays**, tucked behind the unit as a
> level in its class. Stack three of one glyph and the unit *becomes* that hero —
> mid-battle, in front of you, built by your hand. The deck doesn't come *from* a
> hero; the deck **makes** the hero.

This is what makes the name *Sigil Tactics* literal: a sigil is a mark you
inscribe onto a blank unit, and the marks are what it becomes.

### What changes vs v0.20

| System | v0.20 (hero-draft) | Forge rework |
|---|---|---|
| Your 5 units | Drafted heroes, fixed statlines | Identical generic **Recruits** |
| Card types | Equipment + spells + sigils | **One type** — a class Sigil (action) |
| Casting a card | One-shot; gone after use | One-shot effect **+ tuck behind unit = +1 class level** |
| Where cards come from | Union of drafted heroes' suites | One standard deck per player |
| Hero identity | Chosen up front | **Emergent** — 2 tucked cards of one glyph = that hero |
| Passives | Granted by the drafted hero | Granted by **attunement** (2 of a glyph) |
| Growth in a match | None | **Every card you cast levels its unit** — level = cards tucked |
| Health | HP on dice (d4–d20), 2–7 damage | **Wounds** — 2 to kill, no dice (§ Product) |
| Turn order | Speed-order initiative + token | **Act with your lowest-level unit** (fewest tucks) |
| Speed stat | Per-hero, unique | **Removed** — fast classes get a queue-jump instead (§7) |
| Basic attack | Yes (ATK in range) | **Removed** — you must play a card each turn |
| Draft phase | 1-2-2-1 snake | **Removed** |
| Win condition | Kill all enemy units | Unchanged |

---

## 2. The Recruit (the generic unit)

Every unit starts as a **Recruit** — deliberately bland. All ten units (5 a side)
are identical at deploy.

| Stat | Value | Note |
|---|---|---|
| Toughness | 2 wounds | No dice; tank classes raise it on attune (§ Product) |
| ATK | 1 | |
| Move | 1 | |
| Range | 1 | Melee |
| Passive | none | Earned via attunement |
| Level | 0 | = the cards tucked behind it; grows as you play |

No Speed stat (turn order is level-based now, §8). A Recruit does nothing special
until you inscribe sigils onto it. Health is **wounds**, not HP — 2 wounds to
kill, raised only by tank attunement (§ Product) — so there are no dice and no
numbers bigger than a handful.

---

## 3. The Sigil — one card, cast-and-tuck

Every card in the game is a **Sigil**: a single action, marked at the top with a
**class glyph** (⚔️ Knight, 🔮 Mage, 🏹 Ranger, …). There is no other card type.

**Casting a Sigil (the core loop), once per unit per turn:**

1. **Resolve its effect** — the action happens this turn (deal damage, heal,
   push, dash, buff — the existing v0.20 effects, §9).
2. **Tuck it behind the acting unit** — the card stays there for the rest of the
   match as **+1 level in its class.**

So the same act *does something now* and *builds the unit forever*. The card you
attack with is the card that levels you — attack with Knight sigils and you're
becoming a Knight.

**A card every turn — no basic attack.** A unit has no stat-based "just attack"
option. Its entire offense is the sigils you feed it. On its turn it **must cast
one Sigil** (it may also move). This guarantees every turn advances a build and
keeps cards flowing from hand to board.

**The inscribe-for-the-level safety valve.** You may always cast a Sigil purely
to tuck it — taking the level and forgoing the effect — even if its effect can't
or shouldn't resolve (no target in range, etc.). So you can always make a legal
play, and "spend a card just to advance my hero" is a real, deliberate option.

**Every cast pushes you down your own queue.** Because you must act with your
*lowest-level* unit (§8), inscribing a sigil sends that unit toward the back of
the rotation. Levelling is therefore self-limiting and your activations fan out
across all five units — you can't pour your whole hand into one super-unit; the
board levels together. That tension *is* the game's pacing engine.

---

## 4. Levelling = the cards behind you

> **A unit's level is simply how many Sigils are tucked behind it.** Its **class
> level** in any class is how many of that glyph it has.

No XP, no counters, no thresholds — you read level by counting cards. Two numbers
matter, both visible:

- **Total level** (all tucked cards) → drives **turn order** (§8).
- **Class level** (tucked cards of one glyph) → at the attune threshold (**2**),
  the unit **attunes** (§7).

Levelling itself grants **no raw stat bumps** in v1 — the value of a cast is (a)
the effect you got and (b) progress toward attunement, where the real power lives.
This keeps the board math trivial: a unit is a base Recruit until it attunes, then
it's a hero. *(An optional "each class level nudges that class's signature stat"
richness lever is flagged in §13 — left out of v1 for simplicity.)*

---

## 5. (reserved)

*Levelling folded into §3–§4 — there is no separate levelling system to spec. A
unit grows purely by casting sigils, which it must do every turn.*

---

## 6. A unit's turn

Strict alternation between players (the chess-style order the code already uses).
On your turn you activate **one** of your units — and it must be one of your
**lowest-level** units (§8). That unit gets:

- **Move** — optional, up to its Move value, once.
- **Cast a Sigil** — **mandatory**, exactly one (resolve + tuck = +1 class level).

Move and cast may be taken in either order. That's the whole turn — then it
passes to the opponent. There is no aether, no resource cost; the cost of a cast
is the card itself (it leaves your hand forever) and the queue position it spends.

---

## 7. Attunement — becoming a hero

The payoff. The moment a generic Recruit snaps into a named hero.

> **When a unit has 2 tucked Sigils of the same glyph, it _attunes_ to that
> hero** (threshold = `ATTUNE`, tuned to 2 — see Build status). Swap its token for
> the hero; it gains that hero's **passive** and a **signature-stat snap**.

Because turn order forces your activations to spread, attuning a unit takes a few
rotations of deliberately feeding it one glyph — a real, visible build-up.

Snaps are in the wound model (toughness = max wounds; **bold** = in the 5-class base pack):

| Glyph | Passive | Signature snap (at 2) |
|---|---|---|
| **⚔️ Knight** | Steadfast — immune to knockback | **+1 toughness** (3 wounds) |
| **🛡️ Paladin** | Guardian — after a mend card, heal most-wounded ally 1 | **+1 toughness; may mend an ally as its cast** |
| **🔮 Mage** | Resonance — your splash cards +1 wound | **Range 1→2** |
| **🏹 Ranger** | Spotter — your damage cards reach +1 | **Range 1→2** |
| **🗡️ Assassin** | Shadow Step — after moving, your hit is rear-arc | **Move 1→2; flank (side counts as rear); queue-jump** |
| 🪓 Berserker | Bloodthirst — heal 1 when it wounds an enemy | +1 wound on its attacks |
| 🌿 Druid | Symbiosis — after a mend card, heal self 1 | Range 1→2; may mend |
| 🩸 Warlock | Soul Drain — heal 1 when any enemy dies | Range 1→3 |
| 👁️ Scout | Pathfinder — queue-jump | Move 1→2; queue-jump |

**Queue-jump** is how the deleted Speed stat re-enters: an attuned Scout/Assassin
**may be activated even when it isn't your lowest-level unit** — the fast classes
break the rotation, exactly the edge their old high Speed gave them.

**Ascension (`ASCEND` = 4 of a glyph).** Stack four of one class and the unit
Ascends — one more signature step (e.g. Ascended Knight → 4 wounds; Ascended
Assassin → Move 3). Rare in a 24-card deck — the "fully committed" payoff. *(Exact
bonuses — tuning, §13.)*

**The Mercenary (no 2-of-a-glyph).** A mixed unit never attunes — no passive, but
it got every effect it cast and can answer anything. Specialize for a passive, or
stay flexible: a real choice every time you pick which unit to feed which sigil.

---

## 8. Turn order — lowest level acts

Speed and the initiative token are **gone**. Turn order is read straight off the
tucked cards:

> **On your turn you must activate one of your units that is at the lowest level
> (fewest tucked Sigils). You choose which, among the tied-lowest.**

Since casting adds a card, an activated unit rises out of the lowest tier, so you
naturally cycle through all five units before any acts again — a self-enforcing
round-robin with free choice inside each tier. No tracker, no math: just look for
your shortest card-stacks. (Attuned Scout/Assassin may queue-jump — §7.)

- **First player** is decided at match start (random / alternates by game);
  thereafter strict alternation.
- **Dead units** leave the rotation (and their tucked cards leave with them).
- A "round" is just one full pass through your units — emergent, not bookkept.

This replaces the entire v0.20 Speed/initiative/token system. It is the single
biggest simplification in the rework and the most tabletop-friendly: the thing
that tracks turn order is the same thing that tracks levels and identity.

---

## 9. Classes & their Sigil suites

Every card bears a class glyph; casting any of them inscribes a level in that
class. Effects are on the **wound scale** (§ Product): damage in wounds (1, or 2
for a heavy sigil), plus mend / guard / vulnerable / splash. The base pack is the
**24-card mirror deck** below (5 classes × 4 + 4 neutral); the live values are in
`forge.html`.

| Glyph | Sigil | Effect |
|---|---|---|
| ⚔️ Knight | Greatsword / Shield Bash / Bulwark / Cleave | 1 wound · 1 wound + vulnerable 1 · +2 guard (ally) · 1 wound + 1 splash |
| 🏹 Ranger | Quick Shot / Piercing Arrow / Hunter's Mark / Volley | 1 wound · **2 wounds** · 1 wound + vuln 1 · 1 wound + 1 splash |
| 🔮 Mage | Fireball / Lightning / Frostbolt / Magic Missile | 1 wound + 1 splash · **2 wounds** · 1 wound + vuln 1 · 1 wound |
| 🗡️ Assassin | Dagger / Backstab / Shadow Strike / Mask | 1 wound · 1 wound · **2 wounds** · 1 wound + vuln 1 |
| 🛡️ Paladin | Smite / Lay on Hands / Holy Plate / Censure | 1 wound · mend 2 · +2 guard · 1 wound + vuln 1 |
| ✦ Neutral | Zap / Mend / Ward / Quickstep | 1 wound · mend 1 · +1 guard · +2 move |

Casting **Greatsword** deals a wound and tucks a ⚔️; do it twice (across
rotations) and the unit attunes to Knight (§7). Arc/vulnerable add wounds at
resolution, so positioning still drives the damage.

**Neutral Sigils (✦)** bear no attuning glyph — flexible filler, and the natural
pick for the inscribe-for-the-level safety valve. No card is free; one cast per
turn.

**The other four heroes** (🪓 Berserker, 🌿 Druid, 🩸 Warlock, 👁️ Scout) and the
three hidden classes are **expansion-pack** content — authored as 4-sigil suites
on the wound scale when their pack ships.

---

## 10. The deck — one per player

- **One deck per player**, drawn independently. v1 is a **mirror match** (same
  standard decklist both sides), as the paper rules do.
- A **curated ~40-card slice** of the pool (not all ~100), sleeve-and-shuffle
  sized, built so several classes are reachable in a game. The exact 40 is the
  main build/playtest task (§13).
- **Starting hand 3; draw 1 at end of every turn; hand cap 8.** (Unchanged.)
- **Cards deplete.** Cast cards tuck onto units permanently — they never return
  to the deck. The deck is a finite clock; tune its size so matches end by
  elimination well before deck-out. If a player truly can't cast (empty deck +
  hand), that unit passes — the lone exception to "a card every turn." (Edge
  case; flagged §13.)

Deckbuilding (bring-your-own / asymmetric) is a deferred option, not v1.

---

## 11. Match flow

1. **Title** → Skirmish or Campaign (§12).
2. **Deploy.** Place your 5 Recruits anywhere in your two rows. No concealment —
   units are identical. An **Auto** button drops a default formation. *(No draft.)*
3. **Play.** Strict alternation. On your turn, activate one of your lowest-level
   units (§8); it may move and **must cast one Sigil** (resolve + tuck = +1 level,
   §3). Attunement and queue-jumps resolve the instant their card-counts are met.
   Draw 1 at end of turn.
4. **Win.** A side loses when all 5 of its units are at 0 HP. *(Unchanged.)*

No round-start phase, no aether ramp, no refill — turn order and growth are
carried entirely by the tucked-card mechanic.

---

## 12. Campaign, reframed

Heroes are emergent now, so v0.20's "beat a boss to unlock a hero" hook is gone.
Per-match growth (locked) means no persistent units in v1. Lightest-first:

- **Unlock class glyphs.** Start with a few classes in your deck; beat missions to
  add the rest (Paladin sigils, Druid sigils, …). Mirrors the old unlock cadence,
  zero persistence machinery. **v1 recommendation.**
- **Boss modifiers.** Missions give the AI a themed head start (pre-tucked levels,
  a free attunement) — pure encounter design.
- **(Deferred) Persistent run** — the roguelite layer, explicitly later.

---

## 13. Open questions / next steps

**Open questions (need playtest data):**

1. **The standard 40-card list (main tuning task).** Which sigils, in what
   ratios, so several classes are reachable and 3-of-a-glyph attunement actually
   happens in a game? (§10)
2. **Attunement pace.** *(Largely resolved in v0.1 — threshold moved 3→2; heroes
   now emerge in ~98 % of games.)* Still worth watching: with `ATTUNE=2` does a
   hero arrive too *early/cheap*? Further levers if so: fewer units, or relax the
   lowest-level rule (see #3).
3. **Is "lowest level acts" too rigid?** It bars you from using your scary attuned
   unit until the others catch up. Bold and anti-snowball, but may feel
   restrictive. Alternatives if so: "must include a lowest-level unit each round
   but free order otherwise," or a per-turn level cap instead of a hard floor.
4. **No per-level stats.** Is a unit feeling flat until attunement OK? Optional
   richness lever: each class level nudges that class's signature stat by a hair.
5. **Deck-out.** Tune deck size so it's rare; confirm the "pass if you can't cast"
   fallback is acceptable.
6. **Neutral sigils' role.** Do ✦ cards (level but never attune) find a healthy
   niche, or do they just dilute builds?

**Deferred (digital-only or post-v1) — kept out to stay tabletop-legal:**
persistent roguelite runs; deckbuilding / asymmetric decks; per-class-level stat
curves; any hidden counters.

**Build order (✅ steps 1–6 shipped in the v0.1 `forge.html` prototype; step 7 is
the remaining tuning/expansion work):**

1. **Recruit + deploy.** Strip the draft; spawn 5 identical Recruits per side;
   open placement. Game still playable (bland units, basic attack still on).
2. **Cast-and-tuck + must-play-a-card.** Remove the basic attack; make every
   activation cast one card that resolves *and* tucks behind the unit as a visible
   level. Add the inscribe-for-the-level option. This is the heartbeat — get it
   feeling right first.
3. **Lowest-level turn order.** Replace the Speed/initiative system with "activate
   your lowest-level unit"; drop the Speed stat. Confirm activations fan out.
4. **Attunement.** 2-of-a-glyph → passive + signature snap + token swap; queue-jump
   for Scout/Assassin; Ascension at `ASCEND`; Mercenary fallback. The emotional
   payoff. *(Done in v0.1.)*
5. **AI.** AI picks its lowest-level unit, then chooses a sigil — biased toward
   completing an attunement on that unit vs. taking the best immediate effect.
6. **Standard deck + glyphing the pool.** Tag every existing card with its class
   glyph; fold the 10 universals into Neutral; build the ~40-card list.
7. **Tuning + campaign reframe** (§12).

Each step past #1 is independently testable, so we can stop at any slice and still
have a playable game.
