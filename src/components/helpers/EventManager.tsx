import { useEffect } from 'react';

import { useScroll } from '../../store/useScroll.ts';
import { useWindowSize } from '../../store/useWindowSize.ts';

export const EventManager = () => {
  const {
    updateScrollPercentage,
  } = useScroll((state) => {
    return {
      updateScrollPercentage: state.updateScrollPercentage,
    };
  });

  const {
    updateWindowSize,
  } = useWindowSize((state) => {
    return {
      updateWindowSize: state.updateWindowSize,
    };
  });

  const handleScroll = () => {
    updateScrollPercentage(window.scrollY / window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleWindowResize = () => {
    updateWindowSize(window.innerHeight, window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <></>
  );
};
