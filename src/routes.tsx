import { Route, Routes } from 'react-router';

import { App } from '@/App.tsx';
import { HeroScenePortal } from '@/components/scenes/Hero/HeroScenePortal.tsx';

export const BrowserRoutes = () => {
  return (
    <Routes>
      <Route path={'/'} element={<App />} />
      <Route path={'/portal'} element={<HeroScenePortal />} />
    </Routes>
  );
};
