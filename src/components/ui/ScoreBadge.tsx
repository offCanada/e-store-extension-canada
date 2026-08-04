import { type PublicPath } from 'wxt/browser';

// type EcoScoreValue = 'a-plus' | 'a' | 'b' | 'c' | 'd' | 'e';
// type NutriScoreValue = 'a' | 'b' | 'c' | 'd' | 'e';
// type NovaGroupValue = 1 | 2 | 3 | 4;
// type ExtraValues = 'not-applicable' | 'unknown';

// export type ScoreValues = EcoScoreValue | NutriScoreValue | NovaGroupValue | ExtraValues;

interface ScoreIconProps {
  scoreType: 'green-score' | 'nutri-score' | 'nova-group';
  scoreValue: string | number;
  classNames: string;
}

const ScoreBadge = ({ scoreType, scoreValue, classNames }: ScoreIconProps) => {
  const scoreIcon = browser.runtime.getURL(
    `/score/${scoreType}/${scoreValue}.svg` as unknown as PublicPath
  );
  return (
    <>
      <img class={`${classNames}`} src={scoreIcon} alt={`${scoreType}-${scoreValue}`} />
    </>
  );
};

export default ScoreBadge;
