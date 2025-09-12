/**
 * Calculate skill progress percentages based on learner's level index
 * Implements sequential progression: familiarity → mastery → application
 */
export function skillProgress(levelIndex: number) {
  const clamp = (x: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(x)));

  // Phase ramps:
  // Familiarity reaches 100% by level 2
  const familiarity = clamp((levelIndex / 2) * 100);           // 0→100 by L2

  // Mastery starts ramping from level 2, reaches 100% by level 4
  const mastery = clamp(((levelIndex - 2) / 2) * 100);         // 0@L2 →100@L4

  // Applied starts ramping from level 4, reaches 100% by level 6
  const applied = clamp(((levelIndex - 4) / 2) * 100);         // 0@L4 →100@L6

  return {
    trainingFamiliarity: familiarity,
    contentMastery: mastery,
    appliedProficiency: applied
  };
}