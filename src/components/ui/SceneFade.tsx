import { useScene } from '@/store/useScene.ts';

// Black overlay over the canvas (below the UI) that covers the swap back from the coding scene
export const SceneFade = () => {
  const isFadedOut = useScene((s) => s.isFadedOut);

  return (
    <div
      aria-hidden={'true'}
      className={`fixed inset-0 z-[5] bg-black pointer-events-none transition-opacity duration-200 ease-in-out ${isFadedOut ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};
