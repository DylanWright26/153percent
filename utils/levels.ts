export function getLevel(totalXP: number): number {
  let level = 1;
  let xpRequired = 100;
  let xp = totalXP;

  while (xp >= xpRequired) {
    xp -= xpRequired;
    xpRequired = Math.round(xpRequired * 1.5);
    level++;
  }

  return level;
}

export function getXPForCurrentLevel(totalXP: number): number {
  let xpRequired = 100;
  let xp = totalXP;

  while (xp >= xpRequired) {
    xp -= xpRequired;
    xpRequired = Math.round(xpRequired * 1.5);
  }

  return xp;
}

export function getXPNeededForNextLevel(totalXP: number): number {
  let xpRequired = 100;
  let xp = totalXP;

  while (xp >= xpRequired) {
    xp -= xpRequired;
    xpRequired = Math.round(xpRequired * 1.5);
  }

  return xpRequired;
}

export function getLevelProgress(totalXP: number): number {
  const currentXP = getXPForCurrentLevel(totalXP);
  const neededXP = getXPNeededForNextLevel(totalXP);

  return (currentXP / neededXP) * 100;
}
export function getXPNeededForLevel(level: number): number {
  if (level <= 1) return 0;

  let totalXP = 0;
  let xpRequired = 100;

  for (let currentLevel = 1; currentLevel < level; currentLevel++) {
    totalXP += xpRequired;
    xpRequired = Math.round(xpRequired * 1.5);
  }

  return totalXP;
}