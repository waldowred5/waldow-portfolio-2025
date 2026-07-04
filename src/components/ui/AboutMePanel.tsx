import { useEffect } from 'react';
import { IconContext } from 'react-icons';
import { LuBookOpen, LuX } from 'react-icons/lu';

import {
  TABLET_BREAKPOINT,
  THEME_TRANSITION_DURATION,
} from '@/lib/constants.ts';
import { useAboutMePanel } from '@/store/useAboutMePanel.ts';
import { SCENE, useScene } from '@/store/useScene.ts';
import { THEME_COLORS, useTheme } from '@/store/useTheme.ts';

const SKILLS = [
  'TypeScript',
  'React',
  'Three.js / R3F',
  'Node.js',
  'PostgreSQL',
  'GraphQL',
  'AWS',
  'Docker',
  'CI/CD',
  'Datadog',
  'Claude Code',
  'Git',
];

const iconClass =
  'fill-transparent stroke-[#c9c9c9] stroke-[1.5] transition duration-150 group-hover:scale-[106%] group-hover:stroke-white h-4 w-4 mx-2 my-3';

export const AboutMePanel = () => {
  const { isVisible, showPanel, hidePanel } = useAboutMePanel((s) => ({
    isVisible: s.isVisible,
    showPanel: s.showPanel,
    hidePanel: s.hidePanel,
  }));
  const theme = useTheme((s) => s.theme);
  const currentScene = useScene((s) => s.currentScene);
  const isCodingScene = currentScene === SCENE.CODING;

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`);
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && isCodingScene) {
        showPanel();
      }
    };
    mql.addEventListener('change', handleChange);

    return () => mql.removeEventListener('change', handleChange);
  }, [isCodingScene, showPanel]);

  return (
    <>
      <div
        className={`md:hidden fixed top-3 right-3 z-20 group cursor-pointer border-1 border-white backdrop-blur-[10px] backdrop-saturate-[15] bg-black/50 rounded-md transition-opacity duration-500 ${isCodingScene ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={isVisible ? hidePanel : showPanel}
      >
        <div className={'relative flex px-2'}>
          <IconContext.Provider value={{ className: iconClass }}>
            <div
              className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              <LuX />
            </div>
          </IconContext.Provider>
          <div className={'absolute inset-0 flex items-center justify-center'}>
            <IconContext.Provider value={{ className: iconClass }}>
              <div
                className={`transition-opacity duration-300 ${isVisible ? 'opacity-0' : 'opacity-100'}`}
              >
                <LuBookOpen />
              </div>
            </IconContext.Provider>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-[28px] md:inset-[48px] md:left-1/2 border-1 rounded-4xl backdrop-blur-[20px] backdrop-saturate-[2] bg-black/50 origin-top-right ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none max-md:scale-0'}`}
        style={{
          borderColor: THEME_COLORS[theme].secondary,
          transition: `border-color ${THEME_TRANSITION_DURATION}s ease-in-out, opacity 500ms, scale 350ms`,
        }}
      >
        <div
          className={'overflow-y-auto h-full p-8 md:p-10 flex flex-col gap-6'}
        >
          <h1 className={'text-3xl font-bold text-white font-kanit'}>
            {'MEET THE DEV'}
          </h1>
          <div
            className={'w-16 h-[1px]'}
            style={{
              backgroundColor: THEME_COLORS[theme].secondary,
              transition: `background-color ${THEME_TRANSITION_DURATION}s ease-in-out`,
            }}
          />
          <div
            className={
              'flex flex-col gap-4 text-white/80 text-sm leading-relaxed font-kanit'
            }
          >
            <p>
              {
                // eslint-disable-next-line
                "Hi, I'm Waldow,"
              }
            </p>
            <p>
              {
                // eslint-disable-next-line
                "I hail from a small farm outside Port Macquarie, moved to Sydney to study Medical Science and then somehow ended up in software sales. I spent years selling for DocuSign, PagerDuty, and Australia Post's small business division. I was good at it, but something was missing."
              }
            </p>
            <p>
              {
                // eslint-disable-next-line
                "I discovered coding almost by accident and became completely obsessed. After quitting sales I completed a bootcamp and never looked back. Since then I've shipped production software at a superannuation startup (Grow Inc), a software consultancy (Endava) and now build Risk, Governance and Compliance software at RiskSmart in the UK."
              }
            </p>
            <p>
              {
                'In my opinion UI/UX, animation and the tactile feel of interfaces present some of the most interesting and satisfying challenges. I specialise in TypeScript and React, and I have a particular love for 3D web experiences using Three.js and React Three Fiber. Side projects that probably did not need to be this complex are kind of my thing.'
              }
            </p>
            <p>
              {
                'Outside of work I collect hobbies like Pokemon: water skiing, snowboarding, racing motorbikes, electric longboarding, board gaming, painting, piano, drums (I even used to play in a heavy metal band). If it sounds interesting, I have probably already tried it.'
              }
            </p>
          </div>
          <h2 className={'text-xs tracking-[0.2em] text-white/50 font-kanit'}>
            {'SKILLS'}
          </h2>
          <div className={'flex flex-wrap gap-2'}>
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className={
                  'border-1 rounded-full px-3 py-1 text-xs text-white/70'
                }
                style={{
                  borderColor: THEME_COLORS[theme].secondary,
                  transition: `border-color ${THEME_TRANSITION_DURATION}s ease-in-out`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
          <p className={'text-white/80 text-lg font-kanit leading-relaxed'}>
            {'Shoot me a message on '}
            <a
              href={'https://www.linkedin.com/in/daniel-waldow/'}
              target={'_blank'}
              rel={'noreferrer'}
              className={
                'text-white/70 underline hover:text-white transition-colors duration-150'
              }
            >
              {'LinkedIn'}
            </a>
            {', lets connect!'}
          </p>
        </div>
      </div>
    </>
  );
};
