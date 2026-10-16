# Mobile assessment — 16 October 2026

The mobile information bar wrapped the brand, location, phone, email, and social links into multiple rows. Later CSS overrides also reduced navigation and account controls below 44px. Large PNG hero images added roughly 1.8–2.2 MB per page.

## Changes

- A 34px, single-line information ticker below 860px moves continuously from left to right. It includes the brand, consultancy focus, location, phone, and email. Social links remain in the footer.
- A pause/resume button exposes a manually scrollable contact strip. Keyboard focus stops movement, and reduced-motion preferences disable automatic movement. The repeated visual copy is hidden from assistive technology and keyboard interaction.
- Navigation reports its expanded state, closes on Escape, outside presses, and navigation, and scrolls within short screens. Escape restores focus to the menu button.
- Mobile navigation and account controls have 44px touch targets. Header sizing accommodates narrow screens and account names. Form/grid children can shrink, footer contact text wraps, and the floating WhatsApp button respects device safe areas.
- The home heading and hero spacing fit narrow screens. A skip link and visible keyboard focus improve navigation.
- Seven hero images now use WebP, reducing each file by approximately 91–95%. The homepage hero loads with high priority only on the homepage, avoiding a global preload on other routes. Original PNGs are retained as source assets.

## Verification

- All seven main routes checked in local headless Chrome at 320, 390, 768, and 1440 CSS pixels, with no measured horizontal content overflow.
- Ticker movement direction, pause behavior, reduced-motion manual scrolling, mobile menu opening, and Escape dismissal checked in Chrome.
- Mobile homepage screenshot reviewed at 390px.
- Existing test suite: 47 tests passed. Production TypeScript/Vite build passed.

These checks use browser viewport emulation. Physical iOS and Android devices and the production deployment were not tested. Changes are local to this repository.
