import { useEffect } from 'react';

import { FiberCanvas } from '@/components/FiberCanvas.tsx';
import { EventManager } from '@/components/helpers/EventManager.tsx';
import { LevaPanel } from '@/components/helpers/LevaPanel.tsx';
import { ActionBar } from '@/components/ui/ActionBar.tsx';
import { Background } from '@/components/ui/Background.tsx';
import { Hero2DFallback } from '@/components/ui/Hero2DFallback.tsx';
import { HeroLoadingBar } from '@/components/ui/HeroLoadingBar.tsx';
import { useCanvasLoaded } from '@/store/useCanvasLoaded.ts';

// FEATURES TODO:
// - Update text to scale on viewport size
// - Add coding scene (Animated character coding at a desk with matrix style binary flickering in background behind)

// CHORES TODO:
// - Update README

export const App = () => {
  const setFontsReady = useCanvasLoaded((s) => s.setFontsReady);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady());
  }, [setFontsReady]);

  return (
    <>
      <LevaPanel />

      <div className={'flex-col w-full'}>
        <EventManager />
        <Background />
        <FiberCanvas />
        <Hero2DFallback />
        <HeroLoadingBar />
        <ActionBar />
      </div>
    </>
  );
};
