import { BackgroundBeams } from '@/components/ui/acerternity/BackgroundBeams.tsx';

import { FiberCanvas } from './components/FiberCanvas.tsx';
import { EventManager } from './components/helpers/EventManager.tsx';
import { LevaPanel } from './components/helpers/LevaPanel.tsx';
import { ActionBar } from './components/ui/ActionBar.tsx';
import { HeroText } from './components/ui/HeroText.tsx';
import { Section } from './components/ui/Section.tsx';

// FEATURES TODO:
// - Update text to scale on viewport size
// - Add coding scene (Animated character coding at a desk with matrix style binary flickering in background behind)

// CHORES TODO:
// - Update README

export const App = () => {
  return (
    <div className={''}>
      <LevaPanel/>

      <div className={'flex-col w-full'}>
        <EventManager />
        <BackgroundBeams />

        <FiberCanvas />

        <ActionBar />

        <Section>
          <HeroText />
        </Section>
      </div>
    </div>
  );
};
