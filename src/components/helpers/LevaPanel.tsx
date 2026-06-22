import { Leva } from 'leva';

export const LevaPanel = () => {
  const isDev = import.meta.env.MODE === 'development';

  return (
    <>
      <div
        className={'fixed top-20 right-5 z-50'}
        style={{ display: isDev ? 'block' : 'none' }}
      >
        <Leva fill collapsed={true} />
      </div>
    </>
  );
};
