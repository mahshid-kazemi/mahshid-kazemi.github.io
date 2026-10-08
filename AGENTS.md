# Mahshid Kazemi — resume site

Single-page portfolio built from `Mahshid-Kazemi-CV.pdf`. One file, no build step: `index.html`
(CSS + the scene module inline). Fully local: three.js r170 + post-processing addons in `vendor/three/`, fonts (Fraunces + Plus Jakarta Sans) in `fonts/`.

## Run
`python3 -m http.server 5173` then open http://localhost:5173 (ES modules need http, not file://).

## Notes
- 3D scene = the org as a network: 4 clusters (the 4 skill areas) around an HRBP centre node.
  Per-section camera targets live in the `SEC` array; skills rows (`.skill[data-c]`) focus a cluster.
- Layout is text on one side, network on the other (`off` in `SEC`); mobile dims the scene and adds a scrim.
- Sections: hero, profile, experience, approach, skills, education, contact (order must match the `SEC` array in the script).
- Scrolling: a small script snaps one section per wheel/swipe/key (700ms ease, then 300ms input lock: `LOCK`/`DUR`). Sections taller than the viewport scroll natively until their edge.
