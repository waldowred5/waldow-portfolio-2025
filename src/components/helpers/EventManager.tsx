import { useCallback, useEffect } from 'react';

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

  const handleScroll = useCallback(() => {
    updateScrollPercentage(window.scrollY / window.innerHeight);
  }, [updateScrollPercentage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleWindowResize = useCallback(() => {
    updateWindowSize(window.innerHeight, window.innerWidth);
  }, [updateWindowSize]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  return (
    <></>
  );
};
