import { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { practiceRoutes, navRoutes } from '../config/routes';
import './app.css';

function getNavThumb(label: string) {
  const words = label.trim().split(/\s+/);
  if (words.length > 1) {
    return words.map((word) => word[0]).join('').slice(0, 3).toUpperCase();
  }
  return label.slice(0, 2).toUpperCase();
}

function IconChevronLeft() {
  return (
    <svg className="app-nav-toggle__icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg className="app-nav-toggle__icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function App() {
  const [navOpen, setNavOpen] = useState(true);

  return (
    <div className={`app${navOpen ? ' app--nav-open' : ' app--nav-closed'}`}>
      <div className="app-body">
        <aside className="app-sidebar">
          <div className="app-sidebar__header">
            <button
              type="button"
              className="app-nav-toggle"
              onClick={() => setNavOpen((open) => !open)}
              aria-label={navOpen ? 'Collapse navigation' : 'Expand navigation'}
              aria-expanded={navOpen}
            >
              {navOpen ? <IconChevronLeft /> : <IconChevronRight />}
            </button>
            <div className="app-sidebar__brand">
              <span className="app-sidebar__title">Practice Apps</span>
              <span className="app-sidebar__subtitle">React demos</span>
              <span className="app-sidebar__thumb" aria-hidden={navOpen}>
                PA
              </span>
            </div>
          </div>
          <nav className="app-nav" aria-label="Practice pages">
            <ul className="app-nav__list">
              {navRoutes.map(({ path, label }) => {
                const thumb = getNavThumb(label);
                return (
                  <li key={path}>
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
                      }
                      end={path !== '/'}
                      title={label}
                    >
                      <span className="app-nav__thumb" aria-hidden={navOpen}>
                        {thumb}
                      </span>
                      <span className="app-nav__label">{label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="app-content">
          <Routes>
            {practiceRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            <Route path="*" element={<Navigate to="/javascript" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
