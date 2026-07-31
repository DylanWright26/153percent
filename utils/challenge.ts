const START_DATE = new Date("2026-08-01T00:00:00");
const END_DATE = new Date("2026-12-31T23:59:59");

export function getChallengeInfo() {
  const today = new Date();

  // Ignore time when calculating days
  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const startDate = new Date(
    START_DATE.getFullYear(),
    START_DATE.getMonth(),
    START_DATE.getDate()
  );

  const endDate = new Date(
    END_DATE.getFullYear(),
    END_DATE.getMonth(),
    END_DATE.getDate()
  );

  const msPerDay = 1000 * 60 * 60 * 24;

  const totalDays =
    Math.floor(
      (endDate.getTime() - startDate.getTime()) / msPerDay
    ) + 1;

  const day =
    Math.floor(
      (currentDate.getTime() - startDate.getTime()) / msPerDay
    ) + 1;

  const daysRemaining = Math.max(totalDays - day, 0);

  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (currentDate < startDate) {
    return {
      status: "before",
      countdown: Math.ceil(
        (startDate.getTime() - currentDate.getTime()) / msPerDay
      ),
      day: 0,
      totalDays,
      daysRemaining: totalDays,
      progress: 0,
      formattedDate,
    };
  }

  if (currentDate > endDate) {
    return {
      status: "complete",
      day: totalDays,
      totalDays,
      daysRemaining: 0,
      progress: 100,
      formattedDate,
    };
  }

  return {
    status: "active",
    day,
    totalDays,
    daysRemaining,
    progress: Math.round((day / totalDays) * 100),
    formattedDate,
  };
}