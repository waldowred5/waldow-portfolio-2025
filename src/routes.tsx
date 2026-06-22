import { Route, Routes } from 'react-router';

import { App } from '@/App.tsx';
import { HeroPortal } from '@/components/scenes/Hero/HeroPortal.tsx';

export const BrowserRoutes = () => {
  return (
    <Routes>
      <Route path={'/'} element={<App />} />
      <Route path={'/portal'} element={<HeroPortal />} />
    </Routes>
  );
};
