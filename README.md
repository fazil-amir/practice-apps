# Frontend Practice Sandbox

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?style=flat-square&logo=eslint&logoColor=white)](https://eslint.org/)

> React demos on isolated routes — pagination, search, tabs, modals, toasts, infinite scroll, and more.

**Repo:** [github.com/fazil-amir/frontend-practice-sandbox](https://github.com/fazil-amir/frontend-practice-sandbox)

## Quick start

Node 20+ required.

```bash
git clone git@github.com:fazil-amir/frontend-practice-sandbox.git
cd frontend-practice-sandbox
npm install
npm run dev
```

Open `http://localhost:5173` (or the URL Vite prints).

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server + HMR |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |
| `npm run create-page -- <name>` | Scaffold page + route |

## New demo page

```bash
npm run create-page -- my-demo
npm run create-page -- "Post Filters"   # multi-word — use quotes
npm run create-page -- --help
```

| You type | URL | Component | Nav label |
| --- | --- | --- | --- |
| `my-demo` | `/my-demo` | `MyDemo` | My Demo |
| `Post Filters` | `/post-filters` | `PostFilters` | Post Filters |

Output: `src/pages/<slug>/<slug>.tsx`, `<slug>.css`, and a route in `src/config/routes.tsx`.

## Project structure

```
scripts/create-page.mjs
src/
  main.tsx
  app/app.tsx          # Shell + sidebar
  config/routes.tsx    # All routes
  pages/<slug>/        # <slug>.tsx + <slug>.css
  services/            # Shared fetch helpers (optional)
  styles/global.css    # Tokens + resets
  styles/shared.css    # Layout, typography, base buttons
```

Every page is wrapped by the shell (max width **1200px** — no extra wrapper needed):

```html
<main class="practice-page practice-page--<slug>">
  <div class="practice-page__inner page-stack">
    <!-- your component -->
  </div>
</main>
```

## Styling

### Three layers

| Layer | File | Use for |
| --- | --- | --- |
| Tokens | `global.css` | Colors, spacing, shadows, radii |
| Shell | `shared.css` | Layout, typography, global utility classes |
| Page | `<slug>.css` | Demo-only overrides — prefix `.practice-page--<slug>` |

Shared UI → `shared.css`. Theme tokens → `global.css`. Page CSS only when a demo needs something unique.

### Design tokens

Use CSS variables from `global.css` instead of hard-coded colors:

| Token | Use for |
| --- | --- |
| `--bg`, `--surface`, `--surface-muted` | Backgrounds, cards, hovers |
| `--text`, `--text-h`, `--text-muted` | Body, headings, hints |
| `--border`, `--border-subtle` | Borders |
| `--accent`, `--accent-bg`, `--accent-border` | Active / focus |
| `--cta`, `--cta-hover` | Primary buttons |
| `--danger`, `--success`, `--info` | Semantic UI |
| `--shadow-sm`, `--shadow` | Elevation |
| `--radius-sm`, `--radius-md`, `--radius-lg` | Corners |

```css
.practice-page--my-demo .my-card {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

### Built-in (no extra CSS)

`<h1>`, `<h2>`, `<p>`, `<ul>`, and `page-stack` spacing work on every page. Use utility classes for buttons and forms — not unstyled `<button>`.

### Global utility classes (`shared.css`)

| Class | Use for |
| --- | --- |
| `primary-btn`, `secondary-btn` | Main and neutral actions |
| `success-btn`, `danger-btn`, `info-btn` | Semantic actions |
| `practice-card`, `practice-list`, `practice-list__item` | Cards and lists |
| `practice-status`, `practice-status--error` | Loading / empty / error text |
| `field-input`, `input-group`, `checkbox-row` | Forms |
| `page-actions`, `page-pagination` | Button rows / pagination bar |
| `tab-bar`, `tab`, `tab--active`, `tab-panel`, `tab-footer` | Tabs |
| `modal-overlay`, `modal-dialog` | Modal portal |
| `toast-container`, `toast`, `toast--*` | Toast portal |
| `code-output` | Monospace result blocks |
