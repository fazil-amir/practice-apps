#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const pagesDir = join(root, 'src', 'pages');
const routesFile = join(root, 'src', 'config', 'routes.tsx');

function toKebabCase(name) {
  return name
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function toPascalCase(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toLabel(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function usage() {
  console.log(`
Usage: npm run create-page -- <page-name>

Examples:
  npm run create-page -- my-demo
  npm run create-page -- "Post Filters"

Creates:
  src/pages/<slug>/<slug>.tsx
  src/pages/<slug>/<slug>.css

Updates:
  src/config/routes.tsx (import + route entry)
`);
}

function pageTsx(slug, componentName, label) {
  return `import './${slug}.css';

export default function ${componentName}() {
  return (
    <>
      <h1>${label}</h1>
      <p>Replace this with your demo content.</p>
      <button type="button" className="primary-btn">
        Action
      </button>
    </>
  );
}
`;
}

function pageCss(slug) {
  return `/* Page-specific styles for ${slug}. Shared utilities: src/styles/shared.css */\n`;
}

function updateRoutes(slug, componentName, label) {
  let content = readFileSync(routesFile, 'utf8');

  if (content.includes(`'/${slug}'`) || content.includes(`practice-page--${slug}`)) {
    throw new Error(`Route for "${slug}" already exists in routes.tsx`);
  }

  const importLine = `import ${componentName} from '../pages/${slug}/${slug}';`;
  const exportTypeIndex = content.indexOf('export type PracticeRoute');

  if (exportTypeIndex === -1) {
    throw new Error('Could not find "export type PracticeRoute" in routes.tsx');
  }

  content = `${content.slice(0, exportTypeIndex)}${importLine}\n${content.slice(exportTypeIndex)}`;

  const routeEntry = `  {
    path: '/${slug}',
    label: '${label}',
    slug: '${slug}',
    element: withShell('${slug}', ${componentName}),
  },`;

  const navRoutesIndex = content.indexOf('export const navRoutes');
  const arrayEndIndex = content.lastIndexOf('];', navRoutesIndex);

  if (arrayEndIndex === -1) {
    throw new Error('Could not find end of practiceRoutes array');
  }

  content = `${content.slice(0, arrayEndIndex)}${routeEntry}\n${content.slice(arrayEndIndex)}`;

  writeFileSync(routesFile, content, 'utf8');
}

function main() {
  const rawName = process.argv.slice(2).join(' ').trim();

  if (!rawName || rawName === '--help' || rawName === '-h') {
    usage();
    process.exit(rawName ? 0 : 1);
  }

  const slug = toKebabCase(rawName);

  if (!slug) {
    console.error('Error: page name must contain at least one letter or number.');
    process.exit(1);
  }

  const componentName = toPascalCase(slug);
  const label = toLabel(slug);
  const pageDir = join(pagesDir, slug);
  const tsxPath = join(pageDir, `${slug}.tsx`);
  const cssPath = join(pageDir, `${slug}.css`);

  if (existsSync(tsxPath)) {
    console.error(`Error: page already exists at src/pages/${slug}/`);
    process.exit(1);
  }

  mkdirSync(pageDir, { recursive: true });
  writeFileSync(tsxPath, pageTsx(slug, componentName, label), 'utf8');
  writeFileSync(cssPath, pageCss(slug), 'utf8');
  updateRoutes(slug, componentName, label);

  console.log(`Created page: src/pages/${slug}/`);
  console.log(`  - ${slug}.tsx`);
  console.log(`  - ${slug}.css`);
  console.log(`Updated: src/config/routes.tsx`);
  console.log(`Route: /${slug} (${label})`);
  console.log(`\nRun npm run dev and open http://localhost:5173/${slug}`);
}

main();
