import { THEME_TRANSITION_DURATION } from '@/lib/constants.ts';
import { useAboutMePanel } from '@/store/useAboutMePanel.ts';
import { THEME_COLORS, useTheme } from '@/store/useTheme.ts';

const SKILLS = [
  'TypeScript',
  'React',
  'Three.js / R3F',
  'Node.js',
  'PostgreSQL',
  'Docker',
];

const bodyContent = `
Use the following additional content to update teh about me content. It should tell a story rather than be a list of facts. Not all of the
  content is necessarily required to be in the final output:
  - Born in Adelaide, raised on a farm in Port Macquarie, moved to Sydney for University studying medical science
  - After uni I started out as a sales rep in teh software industry (DocuSign, PagerDuty, medical accounting software startup, AusPost
  (small/medium business division))
  - Switched careers by completing a coding bootcamp after discovering and falling in love with coding
  - Worked at a superannuation admin software startup (Grow Inc) followed by software consultancy (Lexicon Digital / Endava) then moved to the UK
  where I now work at another software startup building Risk/Governance/Compliance software (RiskSmart)
  - I collect hobbies like Pokemon: Water skiing, snow skiing, snowboarding, racing motorbikes, electric longboarding, board gaming, painting, piano, drums (I used to play in a heavy metal band), video gaming`;

export const AboutMePanel = () => {
  const { isVisible } = useAboutMePanel((s) => ({ isVisible: s.isVisible }));
  const theme = useTheme((s) => s.theme);

  return (
    <div
      className={`fixed inset-[28px] md:inset-[48px] md:left-1/2 border-1 rounded-4xl backdrop-blur-[10px] backdrop-saturate-[15] bg-black/50 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        borderColor: THEME_COLORS[theme].secondary,
        transition: `border-color ${THEME_TRANSITION_DURATION}s ease-in-out, opacity 700ms`,
      }}
    >
      <div className={'overflow-y-auto h-full p-8 md:p-10 flex flex-col gap-6'}>
        <h1 className={'text-3xl font-bold text-white font-kanit'}>
          {'About Me'}
        </h1>
        <div
          className={'w-16 h-[1px]'}
          style={{
            backgroundColor: THEME_COLORS[theme].secondary,
            transition: `background-color ${THEME_TRANSITION_DURATION}s ease-in-out`,
          }}
        />
        <div
          className={
            'flex flex-col gap-4 text-white/80 text-sm leading-relaxed font-kanit'
          }
        >
          <p>
            {
              "Hi, I'm Daniel — a full-stack engineer with a passion for building things that live at the intersection of code and craft. I specialise in TypeScript, React, and 3D web experiences using Three.js and React Three Fiber."
            }
          </p>
          <p>
            {
              "I care deeply about performance, animation, and the tactile feel of interfaces. When I'm not pushing pixels, I'm exploring emerging tech, tinkering with shaders, or making side projects that probably don't need to be this complex — but are better for it."
            }
          </p>
          <p>
            {
              "Currently open to new opportunities. Let's build something worth looking at."
            }
          </p>
        </div>
        <h2 className={'text-xs tracking-[0.2em] text-white/50 font-kanit'}>
          {'SKILLS'}
        </h2>
        <div className={'flex flex-wrap gap-2'}>
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className={
                'border-1 rounded-full px-3 py-1 text-xs text-white/70'
              }
              style={{
                borderColor: THEME_COLORS[theme].secondary,
                transition: `border-color ${THEME_TRANSITION_DURATION}s ease-in-out`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
