import { CameraControls, Environment, Html } from '@react-three/drei';
import { button, folder, useControls } from 'leva';
import { useEffect, useState } from 'react';

import { Macbook } from '@/components/models/Macbook.tsx';

export const FloatingMacbook = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [occlusionMode, setOcclusionMode] = useState<boolean | 'blending'>(
    false,
  );

  useEffect(() => {
    if (iframeLoaded) {
      // If the iframe is loaded, set occlusion mode to 'blending'
      setOcclusionMode('blending');
    } else {
      // If the iframe is not loaded, disable occlusion
      setOcclusionMode(false);
    }
  }, [iframeLoaded]);

  const defaultMacbookValues = {
    macbookPosition: { x: 0, y: -0.8, z: 1 },
    macbookRotation: { x: 0.34, y: 0.42, z: 0 },
  };

  const defaultPortalValues = {
    portalSizeFactor: 1.14,
    portalPosition: { x: 0, y: 1.56, z: -1.36 },
    portalRotation: { x: -0.26, y: 0, z: 0 },
  };

  const [
    {
      enableCameraControls,
      macbookPosition,
      macbookRotation,
      portalSizeFactor,
      portalPosition,
      portalRotation,
    },
    set,
  ] = useControls(
    'Floating Macbook Scene',
    () => ({
      enableCameraControls: {
        value: true,
        label: 'Enable Camera Controls',
      },
      macbook: folder(
        {
          'Reset Macbook Defaults': button(() => set(defaultMacbookValues)),
          macbookPosition: {
            x: defaultMacbookValues.macbookPosition.x,
            y: defaultMacbookValues.macbookPosition.y,
            z: defaultMacbookValues.macbookPosition.z,
          },
          macbookRotation: {
            x: defaultMacbookValues.macbookRotation.x,
            y: defaultMacbookValues.macbookRotation.y,
            z: defaultMacbookValues.macbookRotation.z,
          },
        },
        { collapsed: false },
      ),
      portal: folder({
        'Reset Portal Defaults': button(() => set(defaultPortalValues)),
        portalSizeFactor: {
          value: defaultPortalValues.portalSizeFactor,
          min: 0.5,
          max: 3,
          step: 0.01,
        },
        portalPosition: {
          x: defaultPortalValues.portalPosition.x,
          y: defaultPortalValues.portalPosition.y,
          z: defaultPortalValues.portalPosition.z,
        },
        portalRotation: {
          x: defaultPortalValues.portalRotation.x,
          y: defaultPortalValues.portalRotation.y,
          z: defaultPortalValues.portalRotation.z,
        },
      }),
    }),
    { collapsed: false },
  );

  return (
    <>
      <CameraControls enabled={enableCameraControls} />
      <Environment preset={'city'} />
      <rectAreaLight
        width={2.5}
        height={1.65}
        intensity={65}
        color={'#ff6900'}
        rotation={[-0.1, Math.PI, 0]}
        position={[0, 0.55, -1.15]}
      />

      <Macbook
        position={[macbookPosition.x, macbookPosition.y, macbookPosition.z]}
        rotation={[macbookRotation.x, macbookRotation.y, macbookRotation.z]}
      >
        <Html
          transform
          occlude={occlusionMode}
          wrapperClass={'htmlScreen'}
          distanceFactor={portalSizeFactor}
          position={[portalPosition.x, portalPosition.y, portalPosition.z]}
          rotation={[portalRotation.x, portalRotation.y, portalRotation.z]}
        >
          <iframe
            src={'/portal'}
            className={'w-[1024px] h-[670px] rounded-[20px] border-none'}
            onLoad={() => setIframeLoaded(true)}
          />
        </Html>
      </Macbook>
    </>
  );
};
