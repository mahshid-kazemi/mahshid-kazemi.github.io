# Mahshid Kazemi — HR portfolio

Static GitHub Pages site. No build step or production dependencies.

## Run

`python3 -m http.server 5173`, then open http://localhost:5173.

## Structure

- `index.html`: English professional content, resume-based experience and education, three HR case studies, contact links and Person metadata.
- `refinements.css`: responsive layout, local-font typography, focus states and reduced-motion support.
- `portfolio.js`: mobile navigation, accessible native-dialog screenshot previews, email copy and passive scroll progress/navigation. Scrolling is native; do not intercept wheel, touch or navigation keys.
- `network.js`: original animated organisation network restored from commit `9026bf9`, including geometry, bloom, pulses, camera transitions, pointer response and skill-cluster focus. Projects have a separate dimmed camera state. Reduced motion disables the scene; mobile uses the original dimming.
- `fonts/`: locally hosted Fraunces and Plus Jakarta Sans.
- `assets/projects/`: the original supplied full-resolution dashboard and calendar PNGs. The requester explicitly asked to remove the dashboard masks; keep these files byte-identical to the supplied originals.
- `Mahshid-Kazemi-CV.pdf`: exact supplied resume. Preserve its bytes.

## Content boundaries

Use the resume for employers, titles, dates and education. HR project contributions cover domain expertise, business analysis, requirements, documentation, content and handoff; do not attribute software engineering or unsupported job titles. Intended project value is not a measured outcome. Telegram remains a placeholder until a username is confirmed.

## Verification

Audit widths 320, 375, 390, 430, 768, 1024, 1440 and 1920. Check all screenshot dialogs, Escape/focus restoration, mobile menu, keyboard navigation, reduced motion, no-JavaScript fallback, contact URL targets, exact PDF download and local asset loading. See `VERIFICATION.md` for the latest results.
