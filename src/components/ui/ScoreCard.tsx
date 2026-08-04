import ScoreBadge from './ScoreBadge';

import { getScoreDescription } from '@/src/utils/scoreDescription';

const ScoreTpyeLabels = {
  'nutri-score': 'Nutri-Score',
  'green-score': 'Green Score',
  'nova-group': 'Nova Group',
};

const ScoreCard = ({
  scoreType,
  grade,
}: {
  scoreType: 'green-score' | 'nutri-score' | 'nova-group';
  grade: string | number;
}) => {
  const scoreDescription = getScoreDescription(scoreType, String(grade));

  return (
    <div class="rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-left">
      <ScoreBadge classNames="h-10" scoreType={scoreType} scoreValue={grade} />
      <p class="mt-2 text-md font-semibold text-gray-600 leading-tight">
        {ScoreTpyeLabels[scoreType]}
      </p>
      {grade && <p class="mt-0.5 text-sm text-gray-500 leading-tight">{scoreDescription}</p>}
    </div>
  );
};

export default ScoreCard;
