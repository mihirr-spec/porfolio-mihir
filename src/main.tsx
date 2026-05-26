import { hydrateRoot, createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import App from './App';

if (typeof window !== 'undefined') {
  import('@vercel/analytics').then(({ inject }) => inject());
}

const container = document.getElementById('root') as HTMLElement;
const app = <StrictMode><App /></StrictMode>;

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
