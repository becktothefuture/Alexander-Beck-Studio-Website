# Glass cover playground

This is a standalone extraction of the studio website's central cockpit glass.

## How the source effect works

- `glass-1.webp` through `glass-9.webp` form a CSS 3x3 nine-slice grid.
- The visual grid is `1, 2, 3 / 4, 5, 6 / 7, 8, 9`. In the Webflow HTML, assets 5 and 4 appear in the opposite DOM order because explicit grid-area rules put 5 in the centre and 4 on the left.
- Rounded corners, dark rim, brackets, uneven highlights and dirt are alpha-masked pixels in the four corner assets. CSS border radius is also used as a safety clip for dynamic overlays, not to draw the main silhouette.
- A separate clipped reflection layer supplies a responsive light cue. The playground improves it by moving the cue with the pointer using CSS custom properties and one requestAnimationFrame update.
- Surface scratches and the scene are optional. They improve material legibility but are not required for the nine-slice glass itself.

The nine images are resized to 512px sources for this experiment. That is enough for the displayed corner tracks, while substantially reducing download and decoded texture memory relative to the roughly 1000px originals.

## Run

```bash
npm install
npm run dev
```
