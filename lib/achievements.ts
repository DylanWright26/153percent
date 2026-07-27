export type AchievementCategory =
  | "firsts"
  | "levels"
  | "missions"
  | "streaks"
  | "milestones"
  | "pbs";


export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
}


export const achievements: Achievement[] = [

  // =========================
  // 🌟 Firsts
  // =========================

  {
    id: "first_mission",
    name: "First Mission",
    description: "Complete your first mission.",
    category: "firsts",
    icon: "🌟",
  },

  {
    id: "first_milestone",
    name: "First Milestone",
    description: "Complete your first milestone.",
    category: "firsts",
    icon: "🏁",
  },

  {
    id: "first_level_up",
    name: "First Level Up",
    description: "Reach Level 2.",
    category: "firsts",
    icon: "⭐",
  },

  {
    id: "first_streak",
    name: "First Streak",
    description: "Reach a 2 day streak.",
    category: "firsts",
    icon: "🔥",
  },

  {
    id: "first_pb",
    name: "First Personal Best",
    description: "Set your first personal best.",
    category: "firsts",
    icon: "📈",
  },


  // =========================
  // ⭐ Levels
  // =========================

  {
    id: "level_5",
    name: "Rising Star",
    description: "Reach Level 5.",
    category: "levels",
    icon: "⭐",
  },

  {
    id: "level_10",
    name: "Double Digits",
    description: "Reach Level 10.",
    category: "levels",
    icon: "⭐",
  },

  {
    id: "level_20",
    name: "Dedicated",
    description: "Reach Level 20.",
    category: "levels",
    icon: "⭐",
  },

  {
    id: "level_35",
    name: "Elite",
    description: "Reach Level 35.",
    category: "levels",
    icon: "⭐",
  },

  {
    id: "level_50",
    name: "Legend",
    description: "Reach Level 50.",
    category: "levels",
    icon: "⭐",
  },
    // =========================
  // 🎯 Missions
  // =========================

  {
    id: "missions_10",
    name: "Getting Started",
    description: "Complete 10 missions.",
    category: "missions",
    icon: "🎯",
  },

  {
    id: "missions_50",
    name: "Momentum",
    description: "Complete 50 missions.",
    category: "missions",
    icon: "🎯",
  },

  {
    id: "missions_100",
    name: "Century Club",
    description: "Complete 100 missions.",
    category: "missions",
    icon: "🎯",
  },

  {
    id: "missions_250",
    name: "Committed",
    description: "Complete 250 missions.",
    category: "missions",
    icon: "🎯",
  },

  {
    id: "missions_500",
    name: "Machine",
    description: "Complete 500 missions.",
    category: "missions",
    icon: "🎯",
  },

  {
    id: "missions_1000",
    name: "153%",
    description: "Complete 1,000 missions.",
    category: "missions",
    icon: "🎯",
  },


  // =========================
  // 🔥 Streaks
  // =========================

  {
    id: "streak_7",
    name: "On Fire",
    description: "Reach a 7 day streak.",
    category: "streaks",
    icon: "🔥",
  },

  {
    id: "streak_30",
    name: "Consistent",
    description: "Reach a 30 day streak.",
    category: "streaks",
    icon: "🔥",
  },

  {
    id: "streak_100",
    name: "Relentless",
    description: "Reach a 100 day streak.",
    category: "streaks",
    icon: "🔥",
  },

  {
    id: "streak_365",
    name: "Unbreakable",
    description: "Reach a 365 day streak.",
    category: "streaks",
    icon: "🔥",
  },


  // =========================
  // 🏁 Milestones
  // =========================

  {
    id: "milestones_5",
    name: "High Achiever",
    description: "Complete 5 milestones.",
    category: "milestones",
    icon: "🏁",
  },

  {
    id: "milestones_10",
    name: "Dream Chaser",
    description: "Complete 10 milestones.",
    category: "milestones",
    icon: "🏁",
  },

  {
    id: "milestones_25",
    name: "Limitless",
    description: "Complete 25 milestones.",
    category: "milestones",
    icon: "🏁",
  },

  {
    id: "milestones_50",
    name: "Milestone Master",
    description: "Complete 50 milestones.",
    category: "milestones",
    icon: "🏁",
  },
    // =========================
  // 📈 Personal Bests
  // =========================

  {
    id: "pb_1",
    name: "Always Improving",
    description: "Set your first personal best.",
    category: "pbs",
    icon: "📈",
  },

  {
    id: "pb_10",
    name: "PB Collector",
    description: "Set 10 personal bests.",
    category: "pbs",
    icon: "📈",
  },

  {
    id: "pb_25",
    name: "Never Settle",
    description: "Set 25 personal bests.",
    category: "pbs",
    icon: "📈",
  },

];