const LEVEL_XP = [
  0,      // Level 1
  125,    // Level 2
  250,    // Level 3
  375,    // Level 4
  500,    // Level 5
  700,    // Level 6
  900,    // Level 7
  1100,   // Level 8
  1300,   // Level 9
  1500,   // Level 10
  1800,   // Level 11
  2100,   // Level 12
  2400,   // Level 13
  2700,   // Level 14
  3000,   // Level 15
  3300,   // Level 16
  3600,   // Level 17
  3900,   // Level 18
  4200,   // Level 19
  4500,   // Level 20
  4850,   // Level 21
  5200,   // Level 22
  5550,   // Level 23
  5900,   // Level 24
  6250,   // Level 25
  6650,   // Level 26
  7050,   // Level 27
  7450,   // Level 28
  7850,   // Level 29
  8250,   // Level 30
  8700,   // Level 31
  9150,   // Level 32
  9600,   // Level 33
  10050,  // Level 34
  10500,  // Level 35
  10960,  // Level 36
  11420,  // Level 37
  11880,  // Level 38
  12340,  // Level 39
  12800,  // Level 40
  13300,  // Level 41
  13900,  // Level 42
  14600,  // Level 43
  15400,  // Level 44
  16400,  // Level 45
  16900,  // Level 46
  17500,  // Level 47
  18200,  // Level 48
  19000,  // Level 49
  20000,  // Level 50
];

export function getLevel(totalXP: number): number {
  let level = 1;

  for (let i = 1; i < LEVEL_XP.length; i++) {
    if (totalXP >= LEVEL_XP[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  return level;
}

export function getXPForCurrentLevel(totalXP: number): number {
  const level = getLevel(totalXP);

  const currentLevelXP = LEVEL_XP[level - 1];

  return totalXP - currentLevelXP;
}

export function getXPNeededForNextLevel(totalXP: number): number {
  const level = getLevel(totalXP);

  if (level >= 50) {
    return 0;
  }

  const currentLevelXP = LEVEL_XP[level - 1];
  const nextLevelXP = LEVEL_XP[level];

  return nextLevelXP - currentLevelXP;
}

export function getLevelProgress(totalXP: number): number {
  const level = getLevel(totalXP);

  if (level >= 50) {
    return 100;
  }

  const currentXP = getXPForCurrentLevel(totalXP);
  const neededXP = getXPNeededForNextLevel(totalXP);

  if (neededXP <= 0) {
    return 100;
  }

  return (currentXP / neededXP) * 100;
}

export function getXPNeededForLevel(level: number): number {
  if (level <= 1) {
    return 0;
  }

  if (level >= 50) {
    return 20000;
  }

  return LEVEL_XP[level - 1];
}