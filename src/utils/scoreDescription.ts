const SCORE_DESCRIPTIONS: Record<string, string> = {
  nutri_score_a: 'Very good nutritional quality',
  nutri_score_b: 'Good nutritional quality',
  nutri_score_c: 'Average nutritional quality',
  nutri_score_d: 'Poor nutritional quality',
  nutri_score_e: 'Bad nutritional quality',
  nutri_score_unknown: 'Unknown nutritional quality',

  nova_group_1: 'Unprocessed or minimally processed',
  nova_group_2: 'Processed culinary ingredients',
  nova_group_3: 'Processed foods',
  nova_group_4: 'Ultra processed foods',
  nova_group_unknown: 'Unknown processing level',

  green_score_a_plus: 'Very low environmental impact',
  green_score_a: 'Very low environmental impact',
  green_score_b: 'Low environmental impact',
  green_score_c: 'Moderate environmental impact',
  green_score_d: 'High environmental impact',
  green_score_e: 'Very high environmental impact',
  green_score_unknown: 'Unknown environmental impact',
};

export function getScoreDescription(scoreType: string, score: string): string | undefined {
  const prefix = scoreType.toLowerCase().replace('-', '_');
  const normalizedScore = score.toLowerCase().replace('-', '_');

  return SCORE_DESCRIPTIONS[`${prefix}_${normalizedScore}`];
}
