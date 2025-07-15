import { useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { PiPaintBucketFill } from 'react-icons/pi';

import { useTheme } from '../../store/useTheme.ts';
import { Icon } from './Icon.tsx';

export const ActionBar = () => {
  const [text, setText] = useState('');

  const {
    toggleTheme,
  } = useTheme((state) => {
    return {
      toggleTheme: state.toggleTheme,
    };
  });

  return (
    <div className={'flex justify-center'}>
      <div className={'z-10 fixed top-3 md:top-4 md:right-4 flex flex-col gap-y-1'}>
        <div
          className={'group/container peer/container hover:cursor-pointer gap-y-4 rounded-md backdrop-blur-[10px] backdrop-saturate-[15] bg-black/50'}
        >
          <div className={'flex grow-0 px-2'}>
            <div
              className={'peer/theme'}
              onMouseEnter={() => setText('CHANGE SITE THEME')}
            >
              <Icon onClick={toggleTheme}>
                <PiPaintBucketFill/>
              </Icon>
            </div>

            <div
              className={'peer/linkedin'}
              onMouseEnter={() => setText('STALK MY CAREER →')}
            >
              <Icon href={'https://www.linkedin.com/in/daniel-waldow-22a85398/'}>
                <FaLinkedin/>
              </Icon>
            </div>

            <div
              className={'peer/github'}
              onMouseEnter={() => setText('STEAL MY CODE →')}
            >
              <Icon href={'https://github.com/waldowred5/waldow-portfolio-2024'}>
                <FaGithub/>
              </Icon>
            </div>
          </div>
        </div>
        <div
          className={`
            peer-hover/container:backdrop-blur-[10px] peer-hover/container:backdrop-saturate-[15]
            peer-hover/container:bg-black/40 text-transparent peer-hover/container:text-white
            transition duration-300 rounded-md h-5 items-center justify-center flex select-none
            `}
        >
          <h2>{text}</h2>
        </div>
      </div>
    </div>
  );
};
