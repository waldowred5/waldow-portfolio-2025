import { Bloom, EffectComposer } from '@react-three/postprocessing';

export const FX = () => {
  return (
    <>
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={0} />
      </EffectComposer>
    </>
  );
};
