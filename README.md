# Project Hell Yeah Demo v2

This repository contains **Project Hell Yeah**, a front‑end demo that walks through a consent-driven advertising flow. Version 2 consolidates the experience into a single HTML file and now includes an automation dashboard for marketers.

## Running the demo

Open `demo-v2.html` in your browser and use **Next** to progress through:

1. The user onboarding flow with an in-page chat overlay and a simulated income verification modal.
2. The brand portal where ad creative is generated.
3. The offer notification summarizing the reward.
4. A marketer automation dashboard highlighting recent user activity.
5. A final wrap-up screen.

A **Replay Demo** button lets you restart the experience. State is stored in `localStorage` and `sessionStorage`, so everything runs in the same tab.

## Other versions

Earlier versions of the demo are preserved in the `archive/` directory. `demo.html` starts the original multi-page flow (`index.html` and `brand.html`). If you want a click-through presentation, open `shell.html` to step through each scene inside a single page.

## Tests

Run `npm test` to execute the automated unit tests.
