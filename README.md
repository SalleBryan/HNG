# Profile Card Webapp

A small, accessible, responsive **Profile Card** demo built with plain HTML, CSS and vanilla JavaScript. Perfect as a starter component for portfolios, UI tests, or as an accessible widget to drop into a static site.

---

## Demo / Quick start

1. Clone or download the project files.
2. Open `index.html` in any modern browser.

To run a tiny local server (recommended for some browser behaviors):

```bash
# from the project directory
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Files included in this project:

* `index.html` — markup and accessibility attributes
* `style.css` — design tokens, responsive layout, animations
* `script.js` — live time, bio toggle, avatar upload logic

---

## Features

* Responsive card layout with modern UI touches (gradient background and subtle animations).
* Live timestamp that updates every second.
* Collapsible bio with accessible "Show more / Show less" toggle and proper `aria-expanded` behaviour.
* Avatar upload: choose an image file and the preview updates using `URL.createObjectURL()` (object URL revoked after the image loads to avoid memory leaks).
* Accessible markup and keyboard-first interactions (tab navigation; toggle supports Enter/Space).
* `data-testid` attributes everywhere to make automated testing reliable.

---

## File structure

```
.
index.html    # markup and accessibility attributes
style.css     # design tokens, responsive layout, animations
script.js     # live time, bio toggle, avatar upload logic
```

---

## Data-testid list (useful for automated tests)

Target these `data-testid` attributes in tests rather than relying on text content:

* `test-profile-card`
* `test-user-name`
* `test-user-bio`
* `test-user-time`
* `test-user-avatar`
* `test-avatar-pic-input`
* `test-avatar-pic-label`
* `test-bio-toggle`
* `test-user-social-links`
* `test-user-social-github`
* `test-user-social-linkedin`
* `test-user-hobbies`
* `test-user-dislikes`
* Per-item ids like `test-hobby-item-1`

---

## Accessibility notes

* Uses semantic HTML (`article`, `header`, `figure`, `section`, headings) and ARIA where helpful (`aria-labelledby`, `aria-controls`, `aria-expanded`).
* Focus styles (`:focus-visible`) are present for keyboard users.
* The live time element uses `aria-live="polite"` so screen readers receive updates without being disruptive.

---

## Customization

* **Visuals:** `style.css` contains CSS custom properties (colors, spacing, radii) — change values in `:root` to retheme quickly.
* **Content:** Edit `index.html` to change name, bio, social links, hobbies, dislikes, or the default avatar image.
* **Behavior:** `script.js` uses small functions (e.g. `updateTime()`, `initBioToggle()`, `initAvatarPic()`), making it simple to extend or replace behavior.

---

## Development notes & tips

* Avatar uploads use `URL.createObjectURL()` for instant preview; revoke the object URL after `load` to avoid memory leaks.
* Bio text is visually clamped with `-webkit-line-clamp` for supported browsers. Toggling removes the clamp class to reveal the full bio.
* For tests, prefer stable `data-testid` attributes instead of text content.

---

## Deployment

This is a static site — deploy to any static hosting provider (GitHub Pages, Netlify, Vercel). Simply push the files to the host; no build step required.

---

## License

MIT — feel free to reuse and adapt. Add a LICENSE file if you want to be explicit.

---
## Tests (Jest)

This project includes a set of example tests written for **Jest** (using the `jsdom` environment) and `@testing-library/dom` to validate core behaviors of the Profile Card:

- Bio toggle expands/collapses and updates `aria-expanded`.
- Avatar file input updates the preview image element (object URL is used for preview).
- Live time element exposes `aria-live="polite"` and shows a value.

### How to run the tests locally

1. Initialize an npm project (if you don't have one):

```bash
npm init -y
```

2. Install dev dependencies:

```bash
npm install --save-dev jest @testing-library/dom @testing-library/jest-dom
```

3. Add a test script to your `package.json` (example):

```json
"scripts": {
  "test": "jest"
}
```

4. Create a test folder and file: `__tests__/profileCard.test.js`.

5. Run tests:

```bash
npm test
```

