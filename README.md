# testing-chickens

This repository contains a small demo of a permission-based advertising flow.

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

For a simple click-through presentation of the demo scenes, open `shell.html`. Use the **Next** button to advance from the Intro through each scene until the end.
