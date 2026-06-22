export const HeroText = () => {
  return (
    <>
      <div
        className={
          'grid grid-rows-sm md:grid-rows-md flex flex-col items-center justify-center w-screen h-lvh text-white select-none'
        }
      >
        <div></div>
        <div className={'flex flex-col items-center'}>
          <h1
            className={'text-xl md:text-7xl lg:text-8xl font-extralight text-shadow-hero'}
          >
            {'DANIEL'}
          </h1>
          <h1
            className={
              'text-7xl/[72px] md:text-[144px]/[144px] lg:text-[208px]/[208px] font-extrabold text-shadow-hero'
            }
          >
            {'WALDOW'}
          </h1>
          <div
            className={'bg-white shadow-sm h-[2px] w-[80vw] my-[20px]'}
          ></div>
        </div>
        <div className={'flex flex-col gap-y-[18px] md:gap-y-[24px]'}>
          <h3
            className={'text-xl md:text-4xl/[36px] font-normal text-center text-shadow-hero'}
          >
            {'BUILD EXPERIENCES WORTH EXPLORING'}
          </h3>
        </div>
      </div>
    </>
  );
};
