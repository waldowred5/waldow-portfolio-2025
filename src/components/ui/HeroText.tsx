// Note: text-shadow not supported by TailwindCSS
// TODO: Remove arbitrary style tags and replace with proper TailwindCSS plugin config to fix text-shadow
// https://tailwindcss.com/docs/plugins#adding-utilities
// https://www.hyperui.dev/blog/text-shadow-with-tailwindcss

import { HeroSubHeading } from './HeroSubHeading.tsx';

export const HeroText = () => {
  return (
    <>
      <div className={'grid grid-rows-sm md:grid-rows-md flex flex-col items-center justify-center w-screen h-lvh text-white select-none'}>
        <div></div>
        <div className={'flex flex-col items-center'}>
          <h1
            className={'text-xl md:text-7xl lg:text-8xl font-extralight'}
            style={{ textShadow: '1px 1px 4px #000000' }}
          >
            {'DANIEL'}
          </h1>
          <h1
            className={'text-7xl/[72px] md:text-[144px]/[144px] lg:text-[208px]/[208px] font-extrabold'}
            style={{ textShadow: '1px 1px 4px #000000' }}
          >
            {'WALDOW'}
          </h1>
          <div className={'bg-white shadow-sm h-[2px] w-[80vw] my-[20px]'}></div>
        </div>
        <div className={'flex flex-col gap-y-[18px] md:gap-y-[24px]'}>
          <div className={'flex flex-col lg:flex-row gap-y-[18px] md:gap-y-[24px] lg:gap-x-[24px] items-center justify-center'}>
            <HeroSubHeading content={'FULL-TIME WEB DEV'} />
            <div className={'hidden lg:flex w-[2px] h-[24px] bg-white shadow-sm'}></div>
            <HeroSubHeading content={'PART-TIME VFX DEV'} />
          </div>
          <HeroSubHeading content={'CASUAL HUMAN'} />
          <HeroSubHeading content={''} />
          <h3></h3>
        </div>
      </div>
    </>
  );
};
