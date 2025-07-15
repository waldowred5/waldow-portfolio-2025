import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { button, folder, useControls } from 'leva';

export const FX = () => {
  const bloomDefaultValues = {
    intensity: 1.2,
    luminanceThreshold: 0.5,
    luminanceSmoothing: 0.74,
  };

  const [{
    intensity,
    luminanceThreshold,
    luminanceSmoothing,
  }, set] = useControls('General', () => ({
    FX: folder({
      'Reset Defaults': button(() => set(bloomDefaultValues)),
      intensity: {
        value: bloomDefaultValues.intensity,
        min: 0,
        max: 10,
        step: 0.1,
      },
      luminanceThreshold: {
        value: bloomDefaultValues.luminanceThreshold,
        min: 0,
        max: 1,
        step: 0.01,
      },
      luminanceSmoothing: {
        value: bloomDefaultValues.luminanceSmoothing,
        min: 0,
        max: 1,
        step: 0.01,
      },
    }, { collapsed: false }),
    }));



  return (
    <>
      <EffectComposer multisampling={4}>
        <Bloom intensity={intensity} luminanceThreshold={luminanceThreshold} luminanceSmoothing={luminanceSmoothing} mipmapBlur />
      </EffectComposer>
    </>
  );
};
