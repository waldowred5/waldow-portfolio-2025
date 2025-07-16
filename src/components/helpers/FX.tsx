import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { button, folder, useControls } from 'leva';

export const FX = () => {
  const bloomDefaultValues = {
    bloomEnabled: true,
    intensity: 1.8,
    luminanceThreshold: 0,
    luminanceSmoothing: 0.18,
  };

  const [
    { bloomEnabled, intensity, luminanceThreshold, luminanceSmoothing },
    set,
  ] = useControls('Settings', () => ({
    FX: folder(
      {
        'Reset Defaults': button(() => set(bloomDefaultValues)),
        bloomEnabled: {
          value: bloomDefaultValues.bloomEnabled,
          onChange: (value) => !value,
          transient: false,
        },
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
      },
      { collapsed: true },
    ),
  }));

  return (
    <>
      {bloomEnabled && <EffectComposer multisampling={4}>
          <Bloom
            intensity={intensity}
            luminanceThreshold={luminanceThreshold}
            luminanceSmoothing={luminanceSmoothing}
            mipmapBlur
          />
      </EffectComposer>
      }
    </>
  );
};
