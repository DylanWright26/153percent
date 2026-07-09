const START_DATE = new Date("2026-08-01");
const END_DATE = new Date("2026-12-31");

export function getChallengeInfo() {
  const today = new Date();

  const msPerDay = 1000 * 60 * 60 * 24;

  const day = Math.floor(
    (today.getTime() - START_DATE.getTime()) / msPerDay
  ) + 1;

  const totalDays =
    Math.floor(
      (END_DATE.getTime() - START_DATE.getTime()) / msPerDay
    ) + 1;

  if (today < START_DATE) {
    return {
      status: "before",
      countdown: Math.ceil(
        (START_DATE.getTime() - today.getTime()) / msPerDay
      ),
      day: 0,
      totalDays,
      progress: 0,
    };
  }

  if (today > END_DATE) {
    return {
      status: "complete",
      day: totalDays,
      totalDays,
      progress: 100,
    };
  }

  return {
    status: "active",
    day,
    totalDays,
    progress: Math.round((day / totalDays) * 100),
  };
}