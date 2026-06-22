import { useEffect,useState } from 'react';

import { TAGLINES } from './heroTextTaglines.ts';

const LETTERS = Object.keys(TAGLINES) as Array<keyof typeof TAGLINES>;
const ELLIPSIS_FRAMES = [1, 2, 3, 2];

function getRandomTagline() {
  const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const { verbs, taglines } = TAGLINES[letter];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const tagline = taglines[Math.floor(Math.random() * taglines.length)];
  return `${verb}${tagline}`;
}

export const HeroText = () => {
  const [tagline, setTagline] = useState(() => getRandomTagline());
  const [visible, setVisible] = useState(true);
  const [dotFrame, setDotFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setDotFrame(f => (f + 1) % ELLIPSIS_FRAMES.length);
    }, 400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTagline(getRandomTagline());
        setVisible(true);
      }, 300);
    }, 6500);
    return () => clearInterval(id);
  }, []);

  const visibleDots = ELLIPSIS_FRAMES[dotFrame];

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
        <div className={'h-[3.5rem] md:h-[5rem] flex items-center justify-center'}>
          <h3
            className={'text-xl md:text-4xl/[36px] font-normal text-center text-shadow-hero uppercase transition-opacity duration-300'}
            style={{ opacity: visible ? 1 : 0 }}
          >
            {tagline}
            <span aria-hidden={'true'}>
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className={'transition-opacity duration-200'}
                  style={{ opacity: visibleDots > i ? 1 : 0 }}
                >
                  {'.'}
                </span>
              ))}
            </span>
          </h3>
        </div>
      </div>
    </>
  );
};
