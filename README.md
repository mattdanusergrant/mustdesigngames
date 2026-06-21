# Must Design Games

A single home for Matt Danuser-Grant's playable game prototypes. One repo, one
GitHub Pages site, **one folder per game** — each a self-contained static build
served at its own sub-path.

**Live:** https://mattdanusergrant.github.io/mustdesigngames/

## Games

| Game | Path |
|------|------|
| Baduk Blitz | [`/baduk-blitz/`](baduk-blitz/) |
| Bloom Again | [`/bloom-again/`](bloom-again/) |
| Eat, Monkey, Eat | [`/eat-monkey-eat/`](eat-monkey-eat/) |
| Groundwork | [`/groundwork/`](groundwork/) |
| Keep Ripping Packs | [`/ripping-packs/`](ripping-packs/) |
| Matgo | [`/matgo/`](matgo/) |
| Mosslings | [`/mosslings/`](mosslings/) |
| Prism Pond | [`/prism-pond/`](prism-pond/) |
| Sigil Tactics | [`/sigil-tactics/`](sigil-tactics/) |
| Split System | [`/split-system/`](split-system/) |
| Switchback TD | [`/switchback-td/`](switchback-td/) |

## Add a new prototype

1. Drop a self-contained folder at the repo root: `my-game/index.html` (+ any
   assets, using **relative** paths so it works under the sub-path).
2. Add a card to the gallery in the root `index.html`.
3. Commit to `main` — the Pages workflow deploys the whole repo automatically.

## How it deploys

`.github/workflows/pages.yml` publishes the repo root to GitHub Pages on every
push to `main`. `.nojekyll` tells Pages to serve files verbatim (no Jekyll).
Static content only — every game here is vanilla HTML/JS/Canvas.
