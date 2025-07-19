import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { BrowserRoutes } from '@/routes.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BrowserRoutes />
    </BrowserRouter>
  </StrictMode>,
);
