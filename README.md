# Project Hell Yeah Demo v2

This repository contains **Project Hell Yeah**, a front‑end demo that walks through a consent-driven advertising flow. The second version packages every scene into a single HTML file so you can explore the experience without navigating between pages.

## Running the demo

Open `demo-v2.html` in your browser and use **Next** to progress through:

1. The user experience with an in-page chat overlay and a simulated income verification modal.
2. The brand portal where creative is generated.
3. The final offer view.

State is stored in `localStorage` and `sessionStorage`, allowing everything to run in the same tab.

## Other versions

Earlier versions of the demo are preserved in the `archive/` directory. `demo.html` starts the original multi-page flow (`index.html` and `brand.html`). If you want a click-through presentation, open `shell.html` to step through each scene inside a single page.

## Tests

Run `npm test` to execute the automated unit tests.
