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