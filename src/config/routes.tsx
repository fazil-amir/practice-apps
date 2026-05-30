import type { ComponentType, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import PostPagination from '../pages/post-pagination/post-pagination';
import TabData from '../pages/tab-data/tab-data';
import Toasts from '../pages/toasts/toasts';
import PostSearchDebounce from '../pages/post-search-debounce/post-search-debounce';
import InfiniteScroll from '../pages/infinite-scroll/infinite-scroll';
import Modal from '../pages/modal/modal';
import Javascript from '../pages/javascript/javascript';
export type PracticeRoute = {
  path: string;
  label: string;
  slug: string;
  element: ReactNode;
  /** Hide from the nav bar (e.g. redirects). */
  hideInNav?: boolean;
};

function pageWrapper(slug: string, children: ReactNode) {
  return (
    <main className={`practice-page practice-page--${slug}`}>
      <div className="practice-page__inner page-stack">{children}</div>
    </main>
  );
}

function withShell(slug: string, Component: ComponentType) {
  return pageWrapper(slug, <Component />);
}

/**
 * Single source of truth for routes and navigation.
 * Add a page: import from `src/pages/<slug>/<slug>.tsx`, add `<slug>.css` in that folder, and register here.
 */
export const practiceRoutes: PracticeRoute[] = [
  {
    path: '/',
    label: 'Home',
    slug: 'home',
    hideInNav: true,
    element: <Navigate to="/javascript" replace />,
  },
  {
    path: '/javascript',
    label: 'Javascript',
    slug: 'javascript',
    element: withShell('javascript', Javascript),
  },
  {
    path: '/post-pagination',
    label: 'Post Pagination',
    slug: 'post-pagination',
    element: withShell('post-pagination', PostPagination),
  },
  {
    path: '/tab-data',
    label: 'Tab Data',
    slug: 'tab-data',
    element: withShell('tab-data', TabData),
  },
  {
    path: '/post-search-debounce',
    label: 'Search Debounce',
    slug: 'post-search-debounce',
    element: withShell('post-search-debounce', PostSearchDebounce),
  },
  {
    path: '/infinite-scroll',
    label: 'Infinite Scroll',
    slug: 'infinite-scroll',
    element: withShell('infinite-scroll', InfiniteScroll),
  },
  {
    path: '/modal',
    label: 'Modal',
    slug: 'modal',
    element: withShell('modal', Modal),
  },
  {
    path: '/toasts',
    label: 'Toasts',
    slug: 'toasts',
    element: withShell('toasts', Toasts),
  },
];

export const navRoutes = practiceRoutes.filter((route) => !route.hideInNav);
