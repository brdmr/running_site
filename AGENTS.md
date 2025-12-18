# Repository Guidelines

## Project Structure & Module Organization
This is a small static site.
- `index.html` contains the page markup and ties the assets together.
- `style.css` holds all styling and layout rules.
- `script.js` contains client-side behavior.
- `CNAME` configures the custom domain for GitHub Pages.

## Build, Test, and Development Commands
There is no build pipeline or test runner configured. For local preview, use a
simple static server:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Coding Style & Naming Conventions
- Indentation: 2 spaces for CSS and HTML, 2 spaces in JavaScript.
- CSS: keep selectors small and scoped; prefer class-based selectors.
- JS: use `const`/`let`, avoid global leakage by keeping code in `script.js`.
- Filenames are lowercase and match their role (`index.html`, `style.css`).

## Testing Guidelines
No automated tests are currently set up. If you add tests, document the
framework, the command to run them, and expected coverage targets here.

## Commit & Pull Request Guidelines
Git history uses short, imperative commit messages (e.g., `initial`,
`Create CNAME`). Keep commits concise and focused on a single change. For pull
requests:
- Describe the change and the user impact.
- Include screenshots for visual updates.
- Link related issues if applicable.

## Configuration & Deployment Notes
This repository is suitable for GitHub Pages. If you change the domain, update
`CNAME` accordingly and verify it in the hosting settings.
