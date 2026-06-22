import { useCanvasLoaded } from '@/store/useCanvasLoaded.ts';

export const HeroLoadingBar = () => {
  const isLoaded = useCanvasLoaded((s) => s.isLoaded);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-[2px] z-30 overflow-hidden bg-white/10"
      style={{
        opacity: isLoaded ? 0 : 1,
        transition: 'opacity 500ms ease-in-out 200ms',
      }}
    >
      <div
        className="absolute h-full"
        style={{
          width: '35%',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)',
          animation: 'loading-slide 1.4s ease-in-out infinite',
        }}
      />
    </div>
  );
};
