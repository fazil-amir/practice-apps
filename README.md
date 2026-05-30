# Practice Apps

A local playground for small React demos—pagination, debounced search, tabs, modals, toasts, infinite scroll, and plain JavaScript experiments. Each demo is an isolated page you can open from the sidebar without touching the others.

Built with **Vite**, **React 19**, **TypeScript**, and **React Router**.

---

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

- **Sidebar** — Left nav lists all demos. Collapse with the chevron; collapsed mode shows square letter thumbs. Nav scrolls when there are many items.
- **Direct URLs** — e.g. `/modal`, `/tab-data`, `/infinite-scroll`
- **Default route** — `/` redirects to `/javascript`

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server + HMR |
| `npm run build` | Typecheck + production build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |

---

## How the app is structured

```
src/
  main.tsx                 Entry: router + global CSS
  app/
    app.tsx                Shell layout + sidebar nav
    app.css                Sidebar only (not page content)
  config/
    routes.tsx             Route table + page wrapper (single source of truth)
  pages/
    <slug>/
      <slug>.tsx           Page component (your demo logic)
      <slug>.css           Page-only styles (required pattern)
      …                    Extra files colocated here (tabs, providers, etc.)
  services/                Shared fetch/helpers (optional)
  styles/
    global.css             Design tokens + resets
    shared.css             Shell: layout width, h1/h2, base buttons
```

**Request flow**

1. `main.tsx` mounts `BrowserRouter` and `App`.
2. `App` renders the sidebar from `navRoutes` and `<Routes>` from `practiceRoutes`.
3. Each route uses `withShell(slug, Component)`, which wraps your page in:

```html
<main class="practice-page practice-page--<slug>">
  <div class="practice-page__inner page-stack">
    <!-- your component -->
  </div>
</main>
```

You do **not** add your own max-width wrapper—the shell already constrains content to **1200px** and applies vertical spacing via `page-stack`.

---

## Naming conventions

Use **kebab-case** for folders and files:

- `src/pages/my-demo/my-demo.tsx`
- `src/pages/my-demo/my-demo.css`
- Route slug: `my-demo` → class `practice-page--my-demo`

---

## Add a new page (checklist)

### 1. Create the folder and component

`src/pages/my-demo/my-demo.tsx`:

```tsx
import './my-demo.css';

export default function MyDemo() {
  return (
    <>
      <h1>My Demo</h1>
      <p>Description of what this demo does.</p>
      <button type="button" className="btn-primary" onClick={() => {}}>
        Run
      </button>
    </>
  );
}
```

**Conventions**

- Import `./my-demo.css` at the top of the tsx file.
- Return a **fragment** (`<>...</>`)—no outer layout div.
- Use a single **`<h1>`** for the page title (styled globally).
- Use **`type="button"`** on buttons unless they submit a form.

### 2. Add page styles

`src/pages/my-demo/my-demo.css` — scope everything under your slug:

```css
/* Primary CTA — copy from javascript.css or infinite-scroll.css */
.practice-page--my-demo .btn-primary {
  background: var(--cta);
  border-color: var(--cta);
  color: #fff;
}

.practice-page--my-demo .btn-primary:hover:not(:disabled) {
  background: var(--cta-hover);
  border-color: var(--cta-hover);
}
```

### 3. Register the route

In `src/config/routes.tsx`:

```tsx
import MyDemo from '../pages/my-demo/my-demo';

// Inside practiceRoutes:
{
  path: '/my-demo',
  label: 'My Demo',        // Sidebar label (expanded nav)
  slug: 'my-demo',         // Must match practice-page--<slug>
  element: withShell('my-demo', MyDemo),
},
```

The sidebar link appears automatically. `label` drives the collapsed thumb initials (e.g. “My Demo” → `MD`).

### 4. Optional extras

| Need | Where to put it |
|------|------------------|
| API helper | `src/services/my-demo.service.ts` |
| Subcomponents | `src/pages/my-demo/my-widget.tsx` |
| Provider/context | `src/pages/my-demo/my-provider.tsx` (see `toasts/`) |
| Notes only (no route) | Any file, exclude from `tsconfig` if invalid TS |

---

## Styling guide (read this for uniform UI)

### Three layers — what goes where

| Layer | File | Responsibility |
|-------|------|----------------|
| **Tokens** | `src/styles/global.css` | Colors, spacing, shadows, radii, fonts. Change the theme here. |
| **Shell** | `src/styles/shared.css` | Page chrome only: `page-stack`, `practice-page__inner` width, shared `h1`/`h2`/`p`, default `button` look. |
| **App chrome** | `src/app/app.css` | Sidebar, nav thumbs, toggle—never page content. |
| **Page** | `src/pages/<slug>/<slug>.css` | Everything specific to that demo. **Always** prefix with `.practice-page--<slug>`. |

**Rule:** If it only applies to one demo → page CSS. If every page needs it (title size, content width) → `shared.css`. If it’s a color/token → `global.css`.

### Design tokens (use these, not hard-coded hex)

Defined in `:root` in `global.css`:

| Token | Typical use |
|-------|-------------|
| `--bg` | Main content background (grey-blue) |
| `--surface` | White cards, inputs, modals |
| `--surface-muted` | Subtle fills, hover states |
| `--text-h` | Headings, emphasis |
| `--text` | Body copy |
| `--text-muted` | Hints, loading text |
| `--border`, `--border-subtle` | Borders |
| `--accent` | Slate blue — active tab, focus ring |
| `--accent-bg`, `--accent-border` | Light accent backgrounds |
| `--cta`, `--cta-hover` | Gold primary actions (`.btn-primary`) |
| `--danger`, `--success`, `--info` | Semantic buttons / toasts |
| `--shadow-sm`, `--shadow` | Card / modal elevation |
| `--radius-sm`, `--radius-md`, `--radius-lg` | Border radius |
| `--layout-max` | 1200px content width |
| `--page-padding` | 24px horizontal padding in shell |

Example:

```css
.practice-page--my-demo .my-box {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

### What you get for free (no extra CSS)

Inside any page, these work without a page CSS file:

- **Layout** — `practice-page__inner` + `page-stack` (16px vertical gap between children)
- **Typography** — `<h1>`, `<h2>`, `<p>`, `<ul>` base styles
- **Buttons** — plain `<button>` gets default bordered style (hover/focus/disabled)

### Reusable class names (define in *your* page CSS)

These class names are a **shared vocabulary**—copy the CSS block from an existing page and change the slug prefix. They are **not** global; each page owns its definitions.

| Class | Purpose | Copy from |
|-------|---------|-----------|
| `btn-primary` | Gold CTA | `javascript.css`, `infinite-scroll.css` |
| `btn-success` / `btn-danger` / `btn-info` | Colored actions | `toasts.css` |
| `practice-card` | White card with border + shadow | `post-pagination.css`, `infinite-scroll.css` |
| `practice-list` / `practice-list__item` | Search results list | `post-search-debounce.css` |
| `practice-status` / `practice-status--error` | Loading & error text | `post-search-debounce.css`, `infinite-scroll.css` |
| `page-search` | Full-width search input | `post-search-debounce.css` |
| `page-pagination` | Prev/Next row | `post-pagination.css` |
| `page-actions` | Horizontal button group | `toasts.css` |
| `tab-bar`, `tab`, `tab--active`, `tab-panel`, `tab-footer` | Tab wizard | `tab-data.css` |
| `input-group` | Label + input stack | `tab-data.css` |
| `checkbox-row` | Checkbox + label row | `tab-data.css` |
| `modal-overlay`, `modal-dialog` | Portal modal (unscoped OK) | `modal.css` |
| `toast-container`, `toast`, `toast--*` | Portal toasts | `toasts.css` |

**Active tab example** (in TSX):

```tsx
className={`tab${isActive ? ' tab--active' : ''}`}
```

### Minimal page template (CSS)

```css
/* src/pages/my-demo/my-demo.css */

/* Cards */
.practice-page--my-demo .practice-card {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

/* Primary button */
.practice-page--my-demo .btn-primary {
  background: var(--cta);
  border-color: var(--cta);
  color: #fff;
}

.practice-page--my-demo .btn-primary:hover:not(:disabled) {
  background: var(--cta-hover);
  border-color: var(--cta-hover);
}
```

### TSX patterns for consistent markup

```tsx
// Page title — one h1 only
<h1>Post Pagination</h1>

// Card list
<article className="practice-card">
  <h2>Title</h2>
  <p>Body</p>
</article>

// Pagination
<div className="page-pagination">
  <button type="button" disabled={…}>Previous</button>
  <button type="button" disabled={…}>Next</button>
</div>

// Search
<input className="page-search" type="text" placeholder="Search…" />

// Status
<p className="practice-status">Loading…</p>
<p className="practice-status practice-status--error">Error: …</p>
```

### Portals (modal, toasts)

Components that `createPortal(..., document.body)` can use **unscoped** classes in the same page folder (`modal-overlay`, `toast-container`) because they render outside `.practice-page`. Keep those classes in the page’s CSS file anyway for colocation.

### Changing the theme

Edit CSS variables in `src/styles/global.css` only. Page CSS should reference `var(--…)` so the whole app updates together.

---

## Current demos

| Path | Slug | What it demonstrates |
|------|------|----------------------|
| `/javascript` | `javascript` | Custom `Array.prototype.myMap` |
| `/post-pagination` | `post-pagination` | Client-side pagination + `services/` fetch |
| `/tab-data` | `tab-data` | Multi-step tabs, validation, `profile-tab` / `interests-tab` |
| `/post-search-debounce` | `post-search-debounce` | Debounced search hook |
| `/infinite-scroll` | `infinite-scroll` | `IntersectionObserver` infinite list |
| `/modal` | `modal` | `createPortal` modal |
| `/toasts` | `toasts` | Context provider + toast portal |

`src/pages/typescript/typescript-notes.ts` is scratch notes only—not routed.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| New page not in nav | Add to `practiceRoutes` in `routes.tsx` (don’t set `hideInNav: true`) |
| Styles not applying | Import `./<slug>.css` in tsx; scope selectors with `.practice-page--<slug>` |
| Content too wide | Don’t set `max-width` on page root—shell handles it |
| Double nav highlight (collapsed) | Style only `.app-nav__thumb` when collapsed—see `app.css` |
| Build fails on `modal.tsx` types | Pre-existing strict TS issues in that file |

---

## Stack

- React 19 · TypeScript · Vite 8 · react-router-dom
