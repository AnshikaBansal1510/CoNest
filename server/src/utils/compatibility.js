/**
 * CoNest Compatibility Engine
 * Scores two users' roommate preferences and returns a 0–100 compatibility score
 * along with a breakdown of each category.
 */

const WEIGHTS = {
  budget:          25,
  lifestyle:       20,
  habits:          20,
  location:        15,
  gender:          10,
  occupation:       5,
  guestPolicy:      5,
};

const proximityScore = (a, b, tolerance) => {
  if (a == null || b == null) return 0.5;
  const diff = Math.abs(a - b);
  return Math.max(0, 1 - diff / tolerance);
};

const matchScore = (a, b) => {
  if (!a || !b || a === 'any' || b === 'any') return 1;
  return a === b ? 1 : 0;
};

const computeCompatibility = (seekerPrefs, targetPrefs) => {
  const s = seekerPrefs || {};
  const t = targetPrefs || {};
  const breakdown = {};

  const budgetScore = proximityScore(s.budget, t.budget, s.budget * 0.3 || 5000);
  breakdown.budget = Math.round(budgetScore * WEIGHTS.budget);

  const sleepMatch = matchScore(s.sleepSchedule, t.sleepSchedule);
  const cleanlinessScore = proximityScore(s.cleanliness, t.cleanliness, 2);
  const noiseMatch = matchScore(s.noiseTolerance, t.noiseTolerance);
  const lifestyleScore = (sleepMatch + cleanlinessScore + noiseMatch) / 3;
  breakdown.lifestyle = Math.round(lifestyleScore * WEIGHTS.lifestyle);

  const smokingMatch = s.smoking === t.smoking ? 1 : 0;
  const drinkingMatch = s.drinking === t.drinking ? 1 : 0.5;
  const petsMatch = s.pets === t.pets ? 1 : 0;
  const habitsScore = (smokingMatch + drinkingMatch + petsMatch) / 3;
  breakdown.habits = Math.round(habitsScore * WEIGHTS.habits);

  const locationScore =
    s.preferredArea && t.preferredArea
      ? (s.preferredArea.toLowerCase() === t.preferredArea.toLowerCase() ? 1 : 0.3)
      : 0.5;
  breakdown.location = Math.round(locationScore * WEIGHTS.location);

  const genderScore = matchScore(s.preferredGender, t.gender);
  breakdown.gender = Math.round(genderScore * WEIGHTS.gender);

  const occupationScore = matchScore(s.occupation, t.occupation);
  breakdown.occupation = Math.round(occupationScore * WEIGHTS.occupation);

  const guestScore = matchScore(s.guestPolicy, t.guestPolicy);
  breakdown.guestPolicy = Math.round(guestScore * WEIGHTS.guestPolicy);

  const score = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const label =
    score >= 80 ? 'Excellent Match 🌟' :
    score >= 60 ? 'Good Match 👍' :
    score >= 40 ? 'Fair Match 🤝' :
                  'Low Compatibility ⚠️';

  return { score, breakdown, label };
};

export { computeCompatibility };