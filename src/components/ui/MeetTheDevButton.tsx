import { LoaderCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { useCodingSceneReady } from '@/store/useCodingSceneReady.ts';
import { SCENE, useScene } from '@/store/useScene.ts';

interface Props {
  // The label animates in only once the button itself is on screen
  isVisible?: boolean;
}

// Matches the ActionBar's width, surface and icon colour
export const MeetTheDevButton = ({ isVisible = true }: Props) => {
  const isReady = useCodingSceneReady((s) => s.isReady);
  const requestScene = useScene((s) => s.requestScene);

  return (
    <button
      type={'button'}
      disabled={!isReady}
      aria-busy={!isReady}
      aria-label={isReady ? 'Meet the Dev' : 'Loading Meet the Dev scene'}
      onClick={() => requestScene(SCENE.CODING)}
      className={`group relative flex items-center justify-center w-[292px] h-12 md:h-14 rounded-md border-1 border-white overflow-hidden transition-colors duration-700 active:scale-[98%] ${isReady ? 'backdrop-blur-[10px] backdrop-saturate-[15] bg-black/50 cursor-pointer' : 'bg-transparent cursor-wait'}`}
    >
      <AnimatePresence>
        {!isReady && (
          <motion.span
            key={'spinner'}
            className={'absolute'}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoaderCircle
              aria-hidden={'true'}
              className={'size-5 md:size-6 text-[#c9c9c9] animate-spin'}
            />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Top-edge fade so the text appears to emerge from the button edge as it slides in */}
      <span
        className={
          'absolute inset-0 flex items-center justify-center mask-t-from-80%'
        }
      >
        {isReady && isVisible && (
          <motion.span
            className={
              'text-lg md:text-xl font-extrabold uppercase tracking-wider whitespace-nowrap text-[#c9c9c9] transition-colors duration-150 group-hover:text-white'
            }
            initial={{ transform: 'translateY(-100%)', opacity: 0 }}
            animate={{ transform: 'translateY(0%)', opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {'Meet the Dev'}
          </motion.span>
        )}
      </span>
    </button>
  );
};
