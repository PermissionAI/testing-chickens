# Project Hell Yeah

This repository contains **Project Hell Yeah**, a front‑end only demo that
walks through a consent-driven advertising flow. It showcases how zero party
data and trusted AI can be presented in an interactive format.

## Running the demo

Open `demo.html` in your browser. The conversation will prefill and you can
press **Next** to advance the scripted flow through:

1. The user flow on `index.html` with an in-page chat overlay and a simulated
   income verification modal.
2. The brand portal on `brand.html`.
3. Returning to the user view to display the final offer.

The demo uses `localStorage` and `sessionStorage`, so running everything in the
same browser tab will let the pages share data.

## Presenter Shell

For a simple click-through presentation of the demo scenes, open `shell.html`. The shell loads each stage of the demo inside an embedded frame so you can step through the entire experience without leaving the page. Use the **Next** button to advance from the Intro through each scene until the end.
