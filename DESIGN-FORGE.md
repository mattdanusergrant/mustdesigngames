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
| Hero identity | Chosen up front | **Emergent** — 3 tucked cards of one glyph = that hero |
| Passives | Granted by the drafted hero | Granted by **attunement** (3 of a glyph) |
| Growth in a match | None | **Every card you cast levels its unit** — level = cards tucked |
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
| HP | 6 (d6) | Smallest "real" die — nowhere to go but up |
| ATK | 1 | |
| Move | 1 | |
| Range | 1 | Melee |
| Passive | none | Earned via attunement |
| Level | 0 | = the cards tucked behind it; grows as you play |

No Speed stat (turn order is level-based now, §8). A Recruit does nothing special
until you inscribe sigils onto it. HP stays on the polyhedral ladder
`{4,6,8,10,12,20}` — it only changes at attunement (a discrete, visible event),
never by off-die increments.

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
- **Class level** (tucked cards of one glyph) → at **3**, the unit **attunes**
  (§7).

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

> **When a unit has 3 tucked Sigils of the same glyph, it _attunes_ to that
> hero.** Swap its token for the hero; it gains that hero's **passive** and a
> **signature-stat snap**.

Because turn order forces your activations to spread, attuning a unit takes a few
rotations of deliberately feeding it one glyph — a real, visible build-up.

| Glyph | Passive | Signature snap (at 3) |
|---|---|---|
| ⚔️ Knight | Steadfast — immune to push/pull | HP die ↑ d6→d10 |
| 🛡️ Paladin | Guardian — after a heal card, +1 to most-wounded ally | HP die ↑ d6→d10; may heal an adjacent ally as its cast |
| 🪓 Berserker | Bloodthirst — heal 1 when it damages an enemy | ATK 1→2; HP die ↑ d6→d8 |
| 🌿 Druid | Symbiosis — after a heal card, heal self 1 | Range 1→2; may heal |
| 🔮 Mage | Resonance — your AoE cards +1 splash | Range 1→2 |
| 🩸 Warlock | Soul Drain — heal 2 when any enemy dies | Range 1→3 |
| 🏹 Ranger | Spotter — your dmg/push/pull cards +1 range | Range 1→2 |
| 👁️ Scout | Pathfinder — your dash cards +1 range | Move 1→2; **queue-jump** |
| 🗡️ Assassin | Shadow Step — after moving, next hit is rear-arc | Move 1→2; flank arcs (side ×2 / rear ×2.5); **queue-jump** |

**Queue-jump** is how the deleted Speed stat re-enters: an attuned Scout/Assassin
**may be activated even when it isn't your lowest-level unit** — the fast classes
break the rotation, exactly the edge their old high Speed gave them.

**Ascension (5 of a glyph).** Fill a unit with five of one class and it Ascends —
passive empowered + one more signature step (e.g. Ascended Knight → d12; Ascended
Assassin → Move 3). A full single-glyph unit is the old v0.20 hero, reconstructed:
the shipped heroes become the "perfect curve" you can aim a unit at. *(Exact
ascension bonuses — tuning, §13.)*

**The Mercenary (no 3-of-a-glyph).** A mixed unit never attunes — no passive, but
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

Every card belongs to a class and bears its glyph; casting any of them inscribes a
level in that class. **Card effects are unchanged from the v0.20 suites in
`DESIGN.md`** — the rework does not re-tune effects. What's new is only that each
card now (a) bears a class glyph and (b) tucks as a level when cast. The class's
*identity* (passive + signature stat) no longer rides on its equipment stats; it
comes entirely from attunement (§7).

**Worked example — the Knight suite (⚔️), effects straight from v0.20:**

| Sigil | Effect (unchanged) |
|---|---|
| Greatsword | 4 dmg to an enemy in range |
| Plate Mail | +5 shield to an ally |
| Iron Helm | 4 dmg (headbutt) |
| Steel Greaves | ally +3 move this turn |
| War Banner | heal all allies +2, all allies +1 ATK this round |
| Cleave | 3 dmg + 1 splash to adjacent |
| Shield Bash | 4 dmg + mark vulnerable (+2 next hit) |
| Rally | heal all allies +2 |
| Shield Wall | +3 shield to all allies |
| Battle Cry | 3 dmg + all allies +2 ATK this round |

Casting **Greatsword** deals 4 and tucks a ⚔️ behind the unit; do that three times
(across rotations) and the unit attunes to Knight. The other eight active classes
work identically — 🏹 Ranger, 🔮 Mage, 🛡️ Paladin, 🩸 Warlock, 🌿 Druid, 🪓
Berserker, 👁️ Scout, 🗡️ Assassin — each with its full v0.20 suite as glyph-bearing
sigils. (Full effect lists live in `DESIGN.md`; they carry over verbatim.)

**Neutral Sigils (✦).** The 10 universal cards become a **Neutral class**:
castable by anyone, they inscribe a level (so they still cost queue position and
count toward total level) but bear no glyph that can attune — flexible filler and
the natural pick for the inscribe-for-the-level safety valve. They are no longer
"free": in a one-card-per-turn world there are no free casts.

**Hidden classes (Sentinel, Necromancer, Crusader)** stay out of the deck, exactly
as today — future glyphs once each has an authored suite.

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
2. **Attunement pace.** Forced round-robin means attuning one unit to 3-of-a-glyph
   takes ~3 rotations. Too slow at 5 units? Levers: attune at 2; fewer units; or
   relax the lowest-level rule (see #3).
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

**Build order for next session (vertical slices, test each before the next):**

1. **Recruit + deploy.** Strip the draft; spawn 5 identical Recruits per side;
   open placement. Game still playable (bland units, basic attack still on).
2. **Cast-and-tuck + must-play-a-card.** Remove the basic attack; make every
   activation cast one card that resolves *and* tucks behind the unit as a visible
   level. Add the inscribe-for-the-level option. This is the heartbeat — get it
   feeling right first.
3. **Lowest-level turn order.** Replace the Speed/initiative system with "activate
   your lowest-level unit"; drop the Speed stat. Confirm activations fan out.
4. **Attunement.** 3-of-a-glyph → passive + signature snap + token swap; queue-jump
   for Scout/Assassin; 5/5 Ascension; Mercenary fallback. The emotional payoff.
5. **AI.** AI picks its lowest-level unit, then chooses a sigil — biased toward
   completing an attunement on that unit vs. taking the best immediate effect.
6. **Standard deck + glyphing the pool.** Tag every existing card with its class
   glyph; fold the 10 universals into Neutral; build the ~40-card list.
7. **Tuning + campaign reframe** (§12).

Each step past #1 is independently testable, so we can stop at any slice and still
have a playable game.
