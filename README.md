# Practice Apps

> A personal playground for React demos — pagination, search, tabs, modals, toasts, infinite scroll, and plain JS experiments. Each demo lives on its own page and doesn't touch the others.

**Stack:** Vite · React 19 · TypeScript · React Router

---

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

---

## Commands

| Command                         | What it does                  |
| ------------------------------- | ----------------------------- |
| `npm run dev`                   | Start dev server with HMR     |
| `npm run build`                 | Type-check + production build |
| `npm run lint`                  | Run ESLint                    |
| `npm run preview`               | Preview production build      |
| `npm run create-page -- <name>` | Scaffold a new demo page      |

---

## Adding a new page

The fastest way is the generator script — it creates the files and registers the route for you:

```bash
npm run create-page -- my-demo
npm run create-page -- "Post Filters"   # multi-word names — use quotes
npm run create-page -- --help
```

**What it generates:**

| File           | Where                               |
| -------------- | ----------------------------------- |
| Page component | `src/pages/my-demo/my-demo.tsx`     |
| Page styles    | `src/pages/my-demo/my-demo.css`     |
| Route + import | appended to `src/config/routes.tsx` |

**Name → output conversion:**

| You type       | URL slug        | Component     | Nav label    |
| -------------- | --------------- | ------------- | ------------ |
| `my-demo`      | `/my-demo`      | `MyDemo`      | My Demo      |
| `Post Filters` | `/post-filters` | `PostFilters` | Post Filters |
| `dummyPage`    | `/dummy-page`   | `DummyPage`   | Dummy Page   |

Once the script runs, start the dev server and open `http://localhost:5173/<slug>` — the page is already in the sidebar.

> **Don't want to use the script?** See the [manual checklist](#manual-setup) below.

---

## Project structure

```
scripts/
  create-page.mjs       # Scaffold new pages
src/
  main.tsx              # App entry point
  app/
    app.tsx             # Shell layout + sidebar
    app.css             # Sidebar styles only
  config/
    routes.tsx          # All routes (single source of truth)
  pages/
    <slug>/
      <slug>.tsx        # Your demo component
      <slug>.css        # Page-scoped styles
  services/             # Shared fetch helpers (optional)
  styles/
    global.css          # Design tokens + resets
    shared.css          # Layout, typography, base buttons
```

The shell wraps every page in:

```html
<main class="practice-page practice-page--<slug>">
	<div class="practice-page__inner page-stack">
		<!-- your component -->
	</div>
</main>
```

You don't need to add a max-width wrapper — the shell already constrains content to **1200px**.

---

## Styling

### Three layers

| Layer  | File         | What goes here                                                                |
| ------ | ------------ | ----------------------------------------------------------------------------- |
| Tokens | `global.css` | Colors, spacing, shadows, radii — change the theme here                       |
| Shell  | `shared.css` | Page chrome: width, typography, base button styles                            |
| Page   | `<slug>.css` | Everything specific to one demo — always prefix with `.practice-page--<slug>` |

**Rule of thumb:** If only one page uses it → page CSS. If every page needs it → `shared.css`. Colors and values → `global.css`.

### Design tokens

Use these CSS variables instead of hard-coded values:

| Token                                        | Use for                         |
| -------------------------------------------- | ------------------------------- |
| `--bg`                                       | Page background                 |
| `--surface`                                  | Cards, inputs, modals           |
| `--surface-muted`                            | Hover fills, subtle backgrounds |
| `--text`, `--text-h`, `--text-muted`         | Body, headings, hints           |
| `--border`, `--border-subtle`                | Borders                         |
| `--accent`, `--accent-bg`, `--accent-border` | Active states, focus rings      |
| `--cta`, `--cta-hover`                       | Primary action buttons          |
| `--danger`, `--success`, `--info`            | Semantic buttons / toasts       |
| `--shadow-sm`, `--shadow`                    | Card / modal elevation          |
| `--radius-sm`, `--radius-md`, `--radius-lg`  | Border radius                   |

```css
.practice-page--my-demo .my-card {
	background: var(--surface);
	border: 1px solid var(--border-subtle);
	border-radius: var(--radius-md);
	box-shadow: var(--shadow-sm);
}
```

### Free styles (no CSS needed)

Inside any page these work out of the box: `<h1>`, `<h2>`, `<p>`, `<ul>`, plain `<button>`, `page-stack` vertical spacing.

### Reusable class names

These are a shared vocabulary — copy the CSS block from an existing page and change the slug prefix. They're not global; each page owns its own definitions.

| Class                                        | Copy from                  |
| -------------------------------------------- | -------------------------- |
| `btn-primary`                                | `javascript.css`           |
| `btn-success/danger/info`                    | `toasts.css`               |
| `practice-card`                              | `post-pagination.css`      |
| `practice-list`, `practice-list__item`       | `post-search-debounce.css` |
| `practice-status`, `practice-status--error`  | `post-search-debounce.css` |
| `page-search`                                | `post-search-debounce.css` |
| `page-pagination`                            | `post-pagination.css`      |
| `tab-bar`, `tab`, `tab--active`, `tab-panel` | `tab-data.css`             |
| `modal-overlay`, `modal-dialog`              | `modal.css`                |
| `toast-container`, `toast`, `toast--*`       | `toasts.css`               |

---

## Manual setup

Use this if you'd rather not run the script.

**1. Create the component** — `src/pages/my-demo/my-demo.tsx`:

```tsx
import "./my-demo.css";

export default function MyDemo() {
	return (
		<>
			<h1>My Demo</h1>
			<p>What this demo does.</p>
			<button type="button" className="btn-primary" onClick={() => {}}>
				Run
			</button>
		</>
	);
}
```

**2. Add page styles** — `src/pages/my-demo/my-demo.css`:

```css
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

**3. Register the route** — in `src/config/routes.tsx`:

```tsx
import MyDemo from '../pages/my-demo/my-demo';

// Inside practiceRoutes array:
{
  path: '/my-demo',
  label: 'My Demo',
  slug: 'my-demo',
  element: withShell('my-demo', MyDemo),
},
```

---

## Current demos

| URL                     | What it shows                        |
| ----------------------- | ------------------------------------ |
| `/javascript`           | Custom `Array.prototype.myMap`       |
| `/post-pagination`      | Client-side pagination               |
| `/tab-data`             | Multi-step tabs with validation      |
| `/post-search-debounce` | Debounced search hook                |
| `/infinite-scroll`      | `IntersectionObserver` infinite list |
| `/modal`                | `createPortal` modal                 |
| `/toasts`               | Context provider + toast portal      |
| `/dummy-page`           | Scaffold example                     |

---

## Troubleshooting

| Problem                           | Fix                                                                                                             |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Want a new page fast              | `npm run create-page -- <name>`                                                                                 |
| `create-page` says already exists | Pick a new name or delete the existing `src/pages/<slug>/` folder and its route entry                           |
| Page not showing in nav           | Make sure it's in `practiceRoutes` in `routes.tsx` without `hideInNav: true`                                    |
| Styles not applying               | Check that you imported `./<slug>.css` in the tsx and that selectors are prefixed with `.practice-page--<slug>` |
| Content too wide                  | Don't set `max-width` on the page root — the shell handles it                                                   |
| Build fails on `modal.tsx`        | Pre-existing strict TS issue in that file, not caused by your changes                                           |
