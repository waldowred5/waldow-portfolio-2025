import { THEME_TRANSITION_DURATION } from '@/lib/constants.ts';
import { type ITheme, THEME_COLORS, useTheme } from '@/store/useTheme.ts';

export const RoundedFrame = () => {
  const { theme } = useTheme((state: ITheme) => ({ theme: state.theme }));

  return (
    <div className={'fixed w-full h-lvh p-5 md:p-10'}>
      <div
        className={'flex w-full h-full border-1 rounded-4xl'}
        style={{
          borderColor: THEME_COLORS[theme].secondary,
          transition: `border-color ${THEME_TRANSITION_DURATION}s ease-in-out`,
        }}
      />
    </div>
  );
};
