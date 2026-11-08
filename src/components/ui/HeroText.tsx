import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { TAGLINES } from './heroTextTaglines.ts';
import { MeetTheDevButton } from './MeetTheDevButton.tsx';

const LETTERS = Object.keys(TAGLINES) as Array<keyof typeof TAGLINES>;
const ELLIPSIS_FRAMES = [1, 2, 3, 2];
// Fast start, slow finish. Full transform strings run as compositor (WAAPI) animations, unaffected by main-thread work.
const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;
const DIVIDER_TRANSITION = { duration: 0.6, delay: 0.15, ease: REVEAL_EASE };
// Text starts once the divider has finished growing
const REVEAL_TRANSITION = {
  duration: 1.2,
  delay: DIVIDER_TRANSITION.delay + DIVIDER_TRANSITION.duration,
  ease: REVEAL_EASE,
};
// CTA fades in once the text has settled
const CTA_TRANSITION = {
  duration: 0.5,
  delay: REVEAL_TRANSITION.delay + REVEAL_TRANSITION.duration,
  ease: 'easeOut',
} as const;

const getRandomTagline = () => {
  const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const { verbs, taglines } = TAGLINES[letter];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const tagline = taglines[Math.floor(Math.random() * taglines.length)];

  return `${verb}${tagline}`;
};

interface Props {
  showCta?: boolean;
  isRevealed?: boolean;
}

export const HeroText = ({ showCta = true, isRevealed = true }: Props) => {
  const [tagline, setTagline] = useState(() => getRandomTagline());
  const [visible, setVisible] = useState(true);
  const [dotFrame, setDotFrame] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isCtaVisible, setIsCtaVisible] = useState(false);

  // Lets the CTA label animate from the moment the CTA starts fading in
  useEffect(() => {
    if (!isRevealed) {
      return;
    }
    const id = setTimeout(
      () => setIsCtaVisible(true),
      CTA_TRANSITION.delay * 1000,
    );

    return () => clearTimeout(id);
  }, [isRevealed]);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 50);

    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setDotFrame((f) => (f + 1) % ELLIPSIS_FRAMES.length);
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
        className={`grid grid-rows-sm md:grid-rows-md flex flex-col items-center justify-center w-screen h-lvh text-white select-none transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      >
        <div></div>
        <div className={'relative flex flex-col items-center'}>
          {/* Name rises out from behind the divider through a fade over the 20px gap above it */}
          <div
            className={
              'flex flex-col items-center overflow-hidden pb-[20px] mask-b-from-[calc(100%-20px)]'
            }
          >
            <motion.div
              className={'flex flex-col items-center'}
              initial={{ transform: 'translateY(100%)' }}
              animate={{
                transform: isRevealed ? 'translateY(0%)' : 'translateY(100%)',
              }}
              transition={REVEAL_TRANSITION}
            >
              <h1
                className={
                  'text-xl md:text-7xl lg:text-hero-daniel font-extralight text-shadow-hero'
                }
              >
                {'DANIEL'}
              </h1>
              <h1
                className={
                  'text-7xl/[72px] md:text-[144px]/[144px] lg:text-hero-waldow font-extrabold text-shadow-hero'
                }
              >
                {'WALDOW'}
              </h1>
            </motion.div>
          </div>
          {/* Grows outwards from its centre */}
          <motion.div
            className={'bg-white shadow-sm h-[2px] w-[80vw] mb-[20px]'}
            initial={{ transform: 'scaleX(0)' }}
            animate={{ transform: isRevealed ? 'scaleX(1)' : 'scaleX(0)' }}
            transition={DIVIDER_TRANSITION}
          />
          {/* Hangs below the divider so the name stays centred on the sun */}
          <div
            className={
              'absolute top-[calc(100%-20px)] left-1/2 -translate-x-1/2 w-[80vw] flex flex-col items-center'
            }
          >
            {/* Tagline drops out from behind the divider through a fade over the 20px gap below it */}
            <div
              className={
                'w-full h-[calc(3.5rem+20px)] md:h-[calc(4rem+20px)] pt-[20px] overflow-hidden mask-t-from-[calc(100%-20px)]'
              }
            >
              <motion.div
                className={'flex justify-center'}
                initial={{ transform: 'translateY(-60px)' }}
                animate={{
                  transform: isRevealed
                    ? 'translateY(0px)'
                    : 'translateY(-60px)',
                }}
                transition={REVEAL_TRANSITION}
              >
                <h3
                  className={`text-xl md:text-hero-tagline font-normal text-center text-shadow-hero uppercase transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
                >
                  {tagline}
                  <span aria-hidden={'true'}>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`transition-opacity duration-200 ${visibleDots > i ? 'opacity-100' : 'opacity-0'}`}
                      >
                        {'.'}
                      </span>
                    ))}
                  </span>
                </h3>
              </motion.div>
            </div>
            {showCta && (
              <motion.div
                className={'mt-14 md:mt-17'}
                initial={{ opacity: 0 }}
                animate={{ opacity: isRevealed ? 1 : 0 }}
                transition={CTA_TRANSITION}
              >
                <MeetTheDevButton isVisible={isCtaVisible} />
              </motion.div>
            )}
          </div>
        </div>
        <div className={'h-[3.5rem] md:h-[5rem]'}></div>
      </div>
    </>
  );
};
