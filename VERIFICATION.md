# Portfolio verification — 14 October 2026 (visual corrections)

## Content and assets

- Employment titles, dates and responsibilities checked against the supplied PDF. Education includes M.S. Psychology (IAU, 2022–2024) and B.S. (FUM, 2018–2022); no bachelor’s subject was inferred.
- Positioning: **HR Business Partner | Strategic People Operations**.
- Exactly three featured case studies, in the requested order. Introductions contain 99, 91 and 94 words. Each separates the challenge, solution/capabilities, contribution and intended HR value.
- Contributions follow the requester’s explicit clarification: HR domain expertise, needs discovery, requirements, PRDs, workflows, content and technical-team collaboration. No software-engineering role or measured project results are claimed.
- At the requester’s explicit direction, removed the dashboard masks and restored the original supplied PNGs byte-for-byte: onboarding 1391×799, performance 1435×756. Images are lossless, retain native aspect ratios, and link to full-resolution files. No artificial upscaling or generated image detail was added.
- All three calendar screenshots are the original supplied PNGs, uncropped and unchanged. No AI-generated screenshots. The optional live calendar demo is not published; this avoids adding its external font dependency and keeps the main portfolio fully local.
- The CV in latest main already matched the supplied resume. It was copied from the supplied asset and verified byte-for-byte, so Git correctly shows no PDF diff. SHA-256: `5a04da6ff7bbc06b537a09b1dd6e83c7ad050a8e34fe1fe4456a5b9f08085f2f`.

## Browser verification

Chromium via Playwright against `python3 -m http.server 5173`:

- Audited **320, 375, 390, 430, 768, 1024, 1440 and 1920px** viewports. No horizontal document overflow, missing image assets, JavaScript exceptions or HTTP errors.
- All five screenshot previews open; native dialog Escape dismissal restores focus to the invoking link. Images retain their natural proportions and have full-size links.
- Mobile menu expands/collapses and closes after section navigation. Links remain visible without JavaScript.
- Native wheel scrolling responds to a small gesture without section snapping or input locks.
- Keyboard skip link works. Focus indicators and native dialog focus containment are retained.
- Restored the original organisation-network scene from commit `9026bf9`: original seeded cluster geometry, nodes, bridges, halos, rings, bloom, travelling pulses, pointer response, camera states and keyboard/hover skill focus. Added the projects camera state and ResizeObserver to accommodate the new case studies. Confirmed all five labels initialize, skill focus selects the correct cluster, and rendering produces no console errors. Mobile retains the original dimming. Reduced-motion mode skips the scene on load and stops rendering when enabled during the session; the simple name reveal remains independent.
- Local fonts, local Three.js and supplied project PNGs load successfully.
- The browser download returns the exact supplied PDF (SHA-256 checked). PDF text extraction succeeds.
- Email, phone, WhatsApp, LinkedIn and GitHub URL targets match the request. This checks link wiring, not device app configuration, message delivery or ownership of external profiles. No messages were sent.
- Telegram now uses the official phone-number deep-link format `https://t.me/+989151234618`, based on the supplied contact number. No username is invented. Account resolution and messaging depend on Telegram privacy settings and device app configuration.
- Automated axe-core WCAG 2 A/AA and WCAG 2.1 AA audit: zero violations at 320px and 1440px. Automated checks do not replace assistive-technology testing.
- Static HTML/CSS/JS; no build required and no production package dependencies added.

## Design references

Reviewed [Ben Clarke’s leadership and culture portfolio](https://www.benclarkehr.com/) and [Tracy Colombo’s HR leadership portfolio](https://www.tracycolombo.com/) for clear professional positioning, experience hierarchy and work-sample presentation. No content or design was copied. The existing dark palette, Fraunces/Plus Jakarta Sans pairing and HR network metaphor remain the visual foundation.

## Human review

- A verified Telegram username can replace the phone-number link if phone-number discovery is restricted.
- The requester authorized merging and publication and explicitly requested the original unmasked screenshots. Their source resolution is the maximum detail available in the supplied files.
- Native application launches require a device with the relevant phone/mail/messaging applications configured.

## Typography refinement

Kept the existing local Fraunces and Plus Jakarta Sans fonts. Increased body text to 16.5px, desktop navigation to 13px, experience bullets and case-study detail text to 15px, and mobile project introductions to 16px. Preserved generous line spacing, responsive heading sizes and focus states.

## Image palettes, frames and portrait

- Inspected the requester’s reference portfolio (read-only). Its actual implementation preserves original screenshots and uses optional SVG color matrices; it does not reconstruct screenshots as HTML. Applied the same Original / Ocean / Amber presentation pattern here. No writes were made to the reference repository.
- Original PNGs and full-size links remain unchanged. Color matrices preserve neutral UI pixels; two decorative layers cross-fade over 300ms. All three case studies and the lightbox share the selection, with guarded localStorage persistence. Original is the initial default. Palette layers are hidden from assistive technology.
- Added subtle asymmetric navy frames with gold/orange borders, restrained hover elevation, and a short lightbox image reveal. Reduced-motion preferences disable these transitions.
- Extracted the original portrait and its alpha mask from PDF image object 10 (1101×1117), without retouching or generating face details. Both the navbar name and hero name open a native, non-modal popover with a navy/gold/orange frame. Escape, outside click and an explicit close button dismiss it; name links open the image directly without JavaScript/popover support.
- Chromium checks at 320, 375, 390, 430, 768, 1024, 1440 and 1920px passed: no overflow or console errors; portrait stays within the viewport; all five screenshot dialogs retain the selected palette and original-size destinations; selection persists on reload.
- Actual rendered snapshots differ across the three palettes. Sampled opacity during the transition was 0.468482, confirming an intermediate cross-fade rather than an abrupt filter swap.
- axe-core WCAG 2 A/AA and WCAG 2.1 AA scans report zero violations at 390px and 1440px. No-JavaScript image/portrait destinations remain available.

## Telegram contact correction

Replaced the non-interactive placeholder with an accessible HTTPS link to `https://t.me/+989151234618`, using the [official Telegram phone-number link syntax](https://core.telegram.org/api/links#phone-number-links). Confirmed the contact is a focusable link, has the expected destination, uses safe new-tab attributes, and retains the platform icon. Link wiring is checked; resolving the account requires Telegram and its privacy settings. No messages or calls were sent.
