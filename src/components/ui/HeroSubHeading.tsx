// Note: text-shadow not supported by TailwindCSS
// TODO: Remove arbitrary style tags and replace with proper TailwindCSS plugin config to fix text-shadow
// https://tailwindcss.com/docs/plugins#adding-utilities
// https://www.hyperui.dev/blog/text-shadow-with-tailwindcss

interface HeroSubHeadingProps {
  content: string;
}

export const HeroSubHeading = ({ content }: HeroSubHeadingProps) => {
  return (
    <>
      <h3
        className={'text-xl md:text-4xl/[36px] font-normal text-center'}
        style={{ textShadow: '1px 1px 4px #000000' }}>
        { content }
      </h3>
    </>
  );
};
