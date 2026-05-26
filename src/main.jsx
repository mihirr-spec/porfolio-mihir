import { hydrateRoot, createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import App from './App';

// Vercel analytics — client-side only
if (typeof window !== 'undefined') {
  import('@vercel/analytics').then(({ inject }) => inject());
}

const container = document.getElementById('root');
const app = <StrictMode><App /></StrictMode>;

// If the page was pre-rendered (has child nodes), hydrate; otherwise fresh render
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
