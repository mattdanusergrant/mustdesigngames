# Sigil Tactics — The Forge Rework (target design)

> **Status: target spec, not yet built.** This document reimagines the game from
> the ground up. The current code (`index.html`, v0.20) still implements the
> *hero-draft* model described in `DESIGN.md`. This file is the design we build
> *toward* next — `DESIGN.md` stays accurate to the shipped build until the
> rebuild lands, at which point it gets replaced by this.

Decisions locked for v1 (2026-06-17):

- **Growth is per-match.** Units start generic every battle; everything forged
  and levelled resets when the match ends. (A persistent roguelite run is a
  natural later layer — explicitly out of scope for v1.)

---

## 1. The inversion

The old game was **hero-first**: you drafted heroes, and each hero handed you a
fixed deck of its cards. The hero was the input; the cards were baggage that
came along.

The new game is **card-first**:

> You deploy **5 generic units** and *inscribe sigils onto them* as you play.
> The cards are the input; the **hero is the output**. The deck doesn't come
> *from* a hero — the deck *makes* the hero.

This is what finally makes the name *Sigil Tactics* mean something. A sigil is a
mark you forge onto a blank unit. Stack the right marks and a nameless recruit
*becomes* a Knight, a Mage, an Assassin — mid-battle, in front of you, built by
your hand.

Nothing about the tactical layer changes. It's still a 5×4 grid, still
facing/flank arcs, still Speed-order initiative, still kill-everything-to-win.
We're swapping the **front half** of the game (draft heroes → forge blanks) and
adding one new axis (**levelling**).

### What changes vs v0.20

| System | v0.20 (hero-draft) | Forge rework |
|---|---|---|
| Your 5 units | Drafted heroes, fixed statlines | Identical generic **Recruits** |
| Where cards come from | Union of your drafted heroes' suites | One shared pool; you draw from it |
| What a card *is* | One-shot spell/equipment | **Forge cards** (permanent) + **Action cards** (one-shot) |
| Hero identity | Chosen up front | **Emergent** — earned by forging a unit down an archetype |
| Passives (Steadfast, etc.) | Granted by the drafted hero | Granted by **attunement** (3+ matching forge cards) |
| Growth during a match | None | **XP → levels → forge slots + stat bumps** |
| Draft phase | 1-2-2-1 snake | **Removed** |
| Deploy phase | Face-down, concealed | Open placement (units are identical — nothing to hide) |
| Win condition | Kill all enemy units | Unchanged |

---

## 2. The Recruit (the generic unit)

Every unit starts the match as a **Recruit** — deliberately bland. All ten units
on the board (5 a side) are mechanically identical at deploy.

| Stat | Value | Note |
|---|---|---|
| HP | 6 (d6) | The smallest "real" die — there's nowhere to go but up |
| ATK | 1 | |
| Move | 1 | |
| Range | 1 | Melee |
| Speed | 2 | Everyone ties at game start — see §8 |
| Passive | none | Earned via attunement |
| Forge slots open | 2 (Weapon, Armor) | More unlock with levels |

A Recruit can attack, move, play action cards, and forge — but it does nothing
*special* until you build it. The fun is in the building.

Recruits keep the polyhedral-die HP rule: max HP only ever lands on
`{4, 6, 8, 10, 12, 20}`. Forge cards and levels raise it die-step to die-step (6
→ 8 → 10 …), never to off-die values.

---

## 3. The two card types

Every card in the game is now exactly one of two things.

### Forge cards (permanent)

A forge card is **equipment** — it attaches to one of your units and **stays
there for the rest of the match**, granting a permanent, ongoing effect. This is
the "craft your units into heroes" mechanic.

- Playing a forge card **costs the active unit's action** for the turn (it may
  still move). Same opportunity-cost economy the game already uses.
- It drops into one of five **named slots**: **Weapon, Armor, Helmet, Boots,
  Artifact**. One card per slot. Slots are unlocked by level (§5).
- Forge cards are **not** removed or swapped in v1 — once forged, it's forged.
  (Re-forging / overwriting a slot is a flagged future option.)
- A forge card can only go on a slot whose tier the unit's level allows
  (Common/Epic/Legendary gating, §5).

The five slots map cleanly onto the equipment the game already has — every hero
suite already ships exactly one Weapon, Armor, Helmet, Boots, and Artifact.

### Action cards (one-shot)

An action card is a **consumable sigil** — the instant spells the game already
has (damage, splash, push, pull, dash, heal, buff). Mechanically these behave
exactly like today's hero action cards + the universal sigils:

- Playing one **costs the active unit's action** (sigils stay free — see below).
- It resolves entirely **this turn** — no lingering forge effect.
- **Any unit may cast any action card** (as today). Caster's range/arc applies.

The universal **10 Sigil cards** survive unchanged: free (cost neither move nor
action), small, removed-on-use. They are the combo grease that lets a built unit
chain a turn together.

> **Rule of thumb:** if the old card was *equipment* (Weapon/Armor/Helmet/Boots/
> Artifact), it's now a **Forge card**. If it was an *Action* or *Spell*, it's
> now an **Action card**. The 60-odd cards already in the game re-slot into the
> new model with almost no invention — see §9.

---

## 4. Forging a unit → the five slots

A unit's identity is the **sum of what's bolted onto it**. The five slots and
what they tend to carry:

| Slot | Typical role | Examples |
|---|---|---|
| **Weapon** | ATK, range, attack shape | Greatsword, Longbow, Staff, Dagger |
| **Armor** | max HP, shields, reflect | Plate Mail, Holy Plate, Bark Skin |
| **Helmet** | small stat / utility bump | Iron Helm, Hawk Hood, Crown of Light |
| **Boots** | Move / Speed | Steel Greaves, Swift Boots, Cat's Boots |
| **Artifact** | the archetype's signature trick | War Banner, Hunter's Mark, Bloodthirster |

A unit with **Greatsword + Plate Mail** is already a tanky bruiser. Add **Iron
Helm + Steel Greaves + War Banner** and it's a Knight in all but name — and at
3 Knight pieces, it literally *becomes* one (§7).

Forge effects are **permanent modifiers**, re-interpreted from each equipment
card's v0.20 flavor. Example — the Knight's gear stops being one-shot hits and
becomes ongoing:

| Card | v0.20 (one-shot) | Forge effect (permanent) |
|---|---|---|
| Greatsword | 4 dmg | **+2 ATK; your attacks splash 1 to enemies adjacent to the target** |
| Plate Mail | +5 shield | **+4 max HP; gain 2 shield at the start of each round** |
| Iron Helm | 4 dmg | **+2 max HP** |
| Steel Greaves | +3 move | **+1 Move** |
| War Banner | heal-all + buff | **Allies in adjacent tiles get +1 ATK (aura)** |

The full per-archetype forge tables are in §9.

---

## 5. Levelling (the "level up as you play" axis)

Units grow by **fighting**. Levelling is what gates how much a unit can be
forged and nudges its raw stats up.

### XP

| Event | XP to the unit |
|---|---|
| Land a damaging attack or damage card (≥1 dmg dealt) | **+1** |
| Land the killing blow on an enemy | **+3** |

(Healing and pure-utility plays grant no XP — you level by drawing blood. Tunable.)

### Level table

| Level | XP to reach | Slots open | Tier allowed | Stat bump on reaching |
|---|---|---|---|---|
| **1** | — (start) | Weapon, Armor (2) | Common | — |
| **2** | 4 | + Helmet (3) | + Epic | +1 max HP (die-step), heal 1 |
| **3** | 9 | + Boots (4) | + Epic | +1 max HP (die-step) |
| **4** | 15 | + Artifact (5) | + Legendary | +2 max HP, +1 Speed |
| **5** | 22 | (cap, 5) | Legendary | +2 max HP, +1 Speed |

Reading it: a fresh Recruit can only forge a **Weapon and Armor**, and only
**Common** gear. It has to *earn* the right to wear a Helmet, then Boots, then an
Artifact — and to slot the Epic and Legendary pieces that define a real hero. The
unit that's winning fights snowballs into something fearsome; the unit that's
been hiding stays a Recruit.

**Counterplay:** the fed unit is exposed on a flankable grid. A level-5 monster
still dies to a rear-arc gang-up. Snowball, meet positioning.

All numbers here are first-pass tuning levers, not gospel — they get dialed in
during playtest.

---

## 6. The action/turn economy (mostly unchanged)

A unit's turn is still **one move + one action, either order**. The action menu
gains one verb:

- **Attack** an enemy in range.
- **Heal** an adjacent ally (only units that can — Druid-attuned, Paladin gear).
- **Play an action card** from hand.
- **Forge a card** — equip a forge card from hand into an open slot. *(new)*
- **Pass.**

**Sigils remain free** (neither move nor action) so combo turns still exist.
Dash/swap action cards still also consume the move slot, as today.

Forging costs the action, exactly like playing a card — so every turn is a real
choice: *build* this unit, or *use* it.

---

## 7. Attunement — becoming a hero

This is the payoff. The moment a generic Recruit snaps into a named hero.

> **When a unit has 3 or more equipped forge cards of the same archetype, it
> _attunes_ to that hero.** It gains:
> - the hero's **name and portrait** (the board token changes),
> - the hero's **passive** (Steadfast, Bloodthirst, Resonance, …),
> - a **signature-stat snap** — the one stat that makes that hero *them*.

Because a unit has only 5 slots, it can hold at most one 3-of-a-kind, so
attunement is never ambiguous.

### Signature-stat snaps

The unique statlines that used to be baked into each hero now arrive as the
attunement reward:

| Archetype | Passive granted | Signature snap |
|---|---|---|
| **Knight** | Steadfast (immune to push/pull) | +2 max HP |
| **Paladin** | Guardian (heal card → +1 to most-wounded) | +2 max HP, gains heal action |
| **Berserker** | Bloodthirst (heal 1 on damaging an enemy) | ATK floor 2 |
| **Druid** | Symbiosis (heal card → self +1) | Range 2, gains heal action |
| **Mage** | Resonance (AoE cards +1 splash/+1 kb) | Range 2 |
| **Warlock** | Soul Drain (heal 2 when any enemy dies) | Range 3 |
| **Ranger** | Spotter (your dmg/push/pull cards +1 range) | Range 2 |
| **Scout** | Pathfinder (your dash cards +1 range) | Move 2, Speed 4 |
| **Assassin** | Shadow Step (after moving, next hit = rear arc) | Move 2, Speed 4, flank arcs (side ×2 / rear ×2.5) |

### Ascension (5/5)

Fill **all five** slots with one archetype and the unit **Ascends**: +2 max HP
and its signature snap is maxed (e.g. Ascended Assassin → Speed 5). A full
single-archetype build *is* the original v0.20 hero, reconstructed — the old
heroes become the "perfect curve" you can aim a unit at.

### The Mercenary (no attunement)

A unit with no 3-of-a-kind (a mixed build) never attunes — it gets **no passive**
but keeps every stat its mismatched gear grants. This is a legitimate generalist
path: a Greatsword + Longbow + Bark Skin brawler that does a bit of everything.
Specialize for a passive, or stay flexible for coverage — a real decision.

---

## 8. Initiative & Speed with identical units

At game start every unit is Speed 2 → **one giant tie**. The existing initiative
system already handles this: the **Initiative token** decides which side's tied
units go first, then flips. Early rounds resolve in formation/id order, which is
fine and even thematic — raw recruits act as a block. As Boots and attunements
come online, speeds spread out and the initiative ribbon gets interesting.

No engine change needed here; just verify the token logic stays sane when a whole
side shares one Speed bracket. (Flagged for playtest in §13.)

---

## 9. Content recategorization — every card, re-slotted

The existing pool re-slots into the new model almost mechanically: **equipment →
Forge**, **actions/spells → Action**. Below, each archetype's 5 equipment pieces
get a permanent **forge effect** (re-interpreted from their v0.20 flavor), and
its 5 action/spell cards stay one-shot (carried over as-is).

Forge effects below are first-pass; the **design principle** is: *a full
single-archetype set should land the unit roughly where that v0.20 hero sat.*

### Knight — bruiser / protector

**Forge:**
| Slot | Card | Forge effect |
|---|---|---|
| Weapon | Greatsword | +2 ATK; attacks splash 1 to enemies adjacent to target |
| Armor | Plate Mail | +4 max HP; +2 shield at round start |
| Helmet | Iron Helm | +2 max HP |
| Boots | Steel Greaves | +1 Move |
| Artifact | War Banner | adjacent allies +1 ATK (aura) |

**Action:** Cleave (dmg-adj 3+1) · Shield Bash (dmg-vuln 4+2) · Rally (heal-all 2) · Shield Wall (shield-all 3) · Battle Cry (dmg-team-buff 3+2)

### Ranger — sniper

**Forge:**
| Slot | Card | Forge effect |
|---|---|---|
| Weapon | Longbow | +1 ATK; +1 Range |
| Armor | Quiver of Sharps | attacks splash 1 |
| Helmet | Hawk Hood | +1 Range |
| Boots | Swift Boots | +1 Move |
| Artifact | Hunter's Mark | your attacks apply +1 vulnerable on hit |

**Action:** Quick Shot (dmg 3) · Volley (dmg-adj 2+1) · Reposition (charge 3) · Piercing Arrow (dmg 5) · Eagle's Eye (dmg-team-buff 2+1)

### Mage — arcane caster

**Forge:**
| Slot | Card | Forge effect |
|---|---|---|
| Weapon | Staff | +1 ATK; +1 Range |
| Armor | Robe of Sparks | attacks splash 1 |
| Helmet | Crown of Light | +2 ATK |
| Boots | Ember Sandals | +1 Move |
| Artifact | Sunflame Orb | your splash radius +1 |

**Action:** Fireball (dmg-adj 3+2) · Frostbolt (dmg-vuln 4+2) · Lightning Strike (dmg 5) · Arcane Blast (dmg-vuln 3+3) · Meteor (dmg 6)

### Paladin — holy tank / support

**Forge:**
| Slot | Card | Forge effect |
|---|---|---|
| Weapon | Warhammer | +2 ATK |
| Armor | Holy Plate | +4 max HP; +3 shield at round start (biggest armor) |
| Helmet | Helm of Faith | +1 max HP; adjacent allies heal 1 at round start (aura) |
| Boots | Sabatons | +1 Move |
| Artifact | Holy Symbol | heal most-wounded ally 2 at round start (aura) |

**Action:** Lay on Hands (heal-shield 5+3) · Smite Evil (dmg 4) · Divine Wrath (dmg-adj 4+1) · Consecration (dmg-adj 3+1) · Sanctuary (dmg 5)

### Warlock — dark caster / lifesteal

**Forge:**
| Slot | Card | Forge effect |
|---|---|---|
| Weapon | Athame | +1 ATK; +1 Range |
| Armor | Shadow Veil | attacks splash 1 |
| Helmet | Hood of Shadows | +1 Range |
| Boots | Boots of Misdirection | +1 Move |
| Artifact | Cursed Skull | your attacks apply +1 vulnerable |

**Action:** Hex (dmg 4) · Eldritch Blast (dmg 5) · Pulse of Decay (dmg-adj 3+1) · Drain Soul (dmg-self-heal 3+3) · Curse of Weakness (dmg-adj 2+2)

### Druid — nature support

**Forge:**
| Slot | Card | Forge effect |
|---|---|---|
| Weapon | Sickle | +1 ATK; attacks splash 1 |
| Armor | Bark Skin | +2 max HP; +2 shield at round start |
| Helmet | Antlered Crown | +1 max HP; adjacent allies +1 ATK (aura) |
| Boots | Mossy Wraps | +1 Move |
| Artifact | Living Wood | heal all allies 1 at round start (aura) |

**Action:** Thorns (dmg 4) · Regrowth (heal-buff 4+2) · Entangle (dmg-adj 3+1) · Lightning Bolt (dmg 5) · Sunbeam (dmg-adj 3+1)

### Berserker — rage melee

**Forge:**
| Slot | Card | Forge effect |
|---|---|---|
| Weapon | Battle Axe | +3 ATK (biggest weapon) |
| Armor | Spiked Pauldrons | +2 max HP; reflect 1 to melee attackers |
| Helmet | Horned Helm | +1 ATK |
| Boots | War Boots | +1 Move |
| Artifact | Bloodthirster | heal 1 whenever you damage an enemy |

**Action:** Frenzy (dmg-team-buff 3+2) · Reckless Charge (dmg-self-charge 3+3) · Whirlwind (dmg-adj 3+1) · Rend (dmg-adj 4+1) · Battle Trance (dmg-self-buff 4+3)

### Scout — fast skirmisher

**Forge:**
| Slot | Card | Forge effect |
|---|---|---|
| Weapon | Shortbow | +1 ATK; +1 Range |
| Armor | Studded Cloak | +1 Move |
| Helmet | Spyglass | +1 Range; attacks apply +1 vulnerable |
| Boots | Cat's Boots | +1 Move; +1 Speed |
| Artifact | Trap | attacks splash 1 |

**Action:** Snipe (dmg 5) · Dash (charge 5) · Vanish (dmg-self-charge 3+3) · Mark Target (dmg-team-buff 2+1) · Shadow Step (charge 4)

### Assassin — burst flanker

**Forge:**
| Slot | Card | Forge effect |
|---|---|---|
| Weapon | Dagger | +2 ATK |
| Armor | Razor Leathers | +1 ATK; +1 Move |
| Helmet | Mask | attacks apply +2 vulnerable |
| Boots | Shadow Boots | +1 Move; +1 Speed |
| Artifact | Death Mark | attacks apply +2 vulnerable (stacks) |

**Action:** Backstab (dmg 5) · Garrote (dmg-adj 2+2) · Smoke Bomb (dmg-team-buff 2+1) · Shadow Strike (dmg 7) · Veil (dmg-self-charge 3+5)

### Universal Sigils (10) — all Action

Carried over unchanged: free, small, removed-on-use generic actions (single
pushes/pulls, dmg 1–2, dash 1–2, heal 2). Any unit casts any sigil; they don't
spend the move or action slot.

### Hidden archetypes (Sentinel, Necromancer, Crusader)

Stay defined but out of the pool, exactly as today. They become future forge
archetypes (each needs a 5-piece equipment set authored) rather than future draft
picks.

---

## 10. The deck & card economy

No draft means no hero-locked decks. The v1 economy is the **simplest thing that
works**:

- Each side runs **one shared pool**: the full set of forge cards + action cards
  + sigils, shuffled into a deck. Both sides draw from identical, independent
  decks (mirror pool).
- **Starting hand 3.** Draw **1 at the end of every turn** (yours or the AI's),
  as today. Hand cap 8.
- Forge cards and action cards are intermixed in the deck — you build with what
  you draw, adapting your archetype plan to your hand. That draw-and-adapt
  tension is the roguelite-deckbuilder heartbeat.

**Known risk (the biggest open question, §13):** a ~100-card mirror pool may make
attunement too luck-dependent — you might never draw 3 Knight pieces. Three
fallbacks, in order of preference, to dial in during playtest:

1. **Curated pool** (~40 cards) weighted so each archetype is reliably reachable.
2. **Forge offers** — on level-up, offer a choice of 1-of-3 forge cards (a light
   "shop"), giving directed building without full deckbuilding.
3. **Pre-match loadout** — bring back deckbuilding (heaviest; least aligned with
   "5 generic units," so last resort).

v1 ships option 0 (full pool) and we let playtest tell us if 1/2 is needed.

---

## 11. Match flow

1. **Title** → pick Skirmish or Campaign (campaign reframed — see §12).
2. **Deploy.** Place your 5 Recruits anywhere in your two rows. No concealment
   (units are identical). An **Auto** button drops a default formation. *(Draft
   phase is gone.)*
3. **Play** — numbered rounds:
   - **Start of round:** both sides draw 1; clear per-turn flags; resolve any
     round-start forge auras (shields, heals).
   - **Initiative pass:** units activate in Speed order, ties broken by the token
     (§8). Each unit gets one move + one action (attack / heal / action card /
     **forge** / pass). XP and level-ups resolve immediately as damage lands.
   - Repeat until no unacted units remain → next round.
4. **Win:** a side loses when all 5 of its units are at 0 HP. *(Unchanged.)*

---

## 12. Campaign, reframed

v0.20's campaign unlocked *heroes* by beating bosses. Heroes are emergent now, so
that hook is gone. Per-match growth (locked decision) means **no persistent
units** in v1. Options for the campaign axis, lightest first — pick during build:

- **Unlock forge archetypes.** Start with 3 archetypes' worth of forge cards in
  your pool; beat missions to add the rest (Paladin set, Druid set, …). Mirrors
  the old unlock cadence, fits the new model, requires no persistence.
- **Boss modifiers.** Each mission gives the AI a themed head start (pre-forged
  units, an extra level) — pure encounter design.
- **(Deferred) Persistent run.** The roguelite layer the Operator explicitly
  pushed to "later." Out of scope for v1.

v1 recommendation: **unlock forge archetypes** — smallest change, keeps campaign
progression meaningful, zero new persistence machinery.

---

## 13. Open questions / next steps

**Open questions (need playtest data):**

1. **Deck economy (biggest).** Full pool vs. curated vs. level-up forge-offers.
   Drives whether attunement feels achievable and intentional. (§10)
2. **Attunement reachability.** Is 3-of-a-kind the right threshold? Does a 6-round
   game give enough turns to forge 3+ pieces on a unit *and* use it?
3. **Snowball vs. comeback.** Does XP-fed levelling create a runaway leader? May
   need diminishing XP, or a catch-up bonus for low-level units.
4. **Early initiative.** Verify the token cleanly resolves a whole side tied at
   Speed 2 round 1.
5. **Forge timing cost.** Is "forge = your whole action this turn" too slow? May
   need a free first-forge, or forging as a move-action instead.
6. **XP from kills only?** Whether utility/healing should grant any XP.

**Build order for next session (vertical slices, test each before the next):**

1. **Recruit + deploy.** Strip the draft; spawn 5 identical Recruits per side;
   open placement on own rows. Game still playable (just bland units).
2. **Forge slots + permanent modifiers.** Add the 5-slot model + "forge = action"
   verb; re-interpret the 3 flagship archetypes' (Knight/Ranger/Mage) equipment
   as permanent forge effects. Confirm a built unit feels distinct.
3. **XP + levels.** Wire XP from damage/kills, the level table, slot + tier
   gating, stat bumps. Confirm a unit visibly grows.
4. **Attunement.** 3-of-a-kind → passive + signature snap + portrait/name swap;
   5/5 Ascension; Mercenary fallback. The emotional payoff — get it feeling good.
5. **AI forging.** AI scores forge-toward-an-archetype vs. attack vs. action card;
   early rounds bias to building, later to damage; picks pieces matching its
   unit's current dominant archetype.
6. **Port remaining 6 archetypes** + re-slot the action pool + sigils.
7. **Economy tuning** per open question 1; **campaign reframe** per §12.

Everything downstream of step 1 is independently testable, so we can stop at any
slice and still have a playable game.
