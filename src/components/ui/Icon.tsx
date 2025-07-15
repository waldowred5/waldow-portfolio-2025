import React from 'react';
import { IconContext } from 'react-icons';

interface IconProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export const Icon = ({ children, href, onClick }: IconProps) => {
  return (
    <>
      <div
        className={'group flex active:scale-[90%]'}
        onClick={onClick}
      >
        <IconContext.Provider value={{
          className: 'fill-[#c9c9c9] transition duration-150 group-hover:scale-[106%] group-hover:fill-white h-8 md:h-12 w-8 md:w-12 mx-2 my-3 md:my-4'
        }}>
          { href ?
            <a href={href} target={'_blank'}>
              { children }
            </a>
            : children
          }
        </IconContext.Provider>
      </div>
    </>
  );
};
