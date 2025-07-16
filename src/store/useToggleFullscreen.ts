import { useState } from 'react';

export const useToggleFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    if (
      !document.fullscreenElement && !isFullscreen
    ) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error('Error attempting to enter fullscreen mode:', error);
      }
    }

    if (document.fullscreenElement && isFullscreen) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (error) {
        console.error('Error attempting to exit fullscreen mode:', error);
      }
    }
  };

  return { isFullscreen, toggleFullscreen };
};
