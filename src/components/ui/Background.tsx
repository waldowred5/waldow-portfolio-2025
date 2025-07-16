import { BackgroundBeams } from '@/components/ui/acerternity/BackgroundBeams.tsx';

export const Background = () => {
  return (
    <>
      <BackgroundBeams />
      <div className={'fixed w-full h-lvh p-5 md:p-10'}>
        <div className={'flex w-full h-full border-1 border-white rounded-4xl'} />
      </div>
    </>
  );
};