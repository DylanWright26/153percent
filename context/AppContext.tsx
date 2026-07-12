"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";

export interface Mission {
  id: string;
  name: string;
  category: string;
  frequency: string;
  target: number;
  progress: number;
  unit: string;
  xp: number;
  completion_bonus: number;
  required_for_streak: boolean;
  active: boolean;
}

export interface Profile {
  user_id: string;
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
}

interface AppContextType {
  missions: Mission[];
  profile: Profile | null;
  loading: boolean;
  refreshMissions: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateMissionProgress: (
  mission: Mission,
  change: number
) => Promise<void>;
  deleteMission: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshMissions() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setMissions([]);
    return;
  }

  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  const sortedMissions = [...(data ?? [])].sort((a, b) => {
    // 1. Streak missions first
    if (a.required_for_streak !== b.required_for_streak) {
      return a.required_for_streak ? -1 : 1;
    }

    // 2. Highest completion %
    const aProgress = a.target > 0 ? a.progress / a.target : 0;
    const bProgress = b.target > 0 ? b.progress / b.target : 0;

    if (aProgress !== bProgress) {
      return bProgress - aProgress;
    }

    // 3. Highest XP
    if (a.xp !== b.xp) {
      return b.xp - a.xp;
    }

    // 4. Oldest first
    return 0;
  });

  setMissions(sortedMissions);
}

  async function refreshProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setProfile(data);
  }
  async function updateMissionProgress(
  mission: Mission,
  change: number
) {
  const progressXP = mission.xp / mission.target;

  const xpChange =
    change > 0 ? progressXP : -progressXP;

  const newProgress = Math.max(
    0,
    Math.min(
      mission.target,
      mission.progress + change
    )
  );
const wasComplete = mission.progress >= mission.target;
const isComplete = newProgress >= mission.target;

let totalXpChange = xpChange;

if (!wasComplete && isComplete) {
  totalXpChange += mission.completion_bonus;
}

if (wasComplete && !isComplete) {
  totalXpChange -= mission.completion_bonus;
}
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  if (newProgress === mission.progress) {
    return;
  }

  const { error } = await supabase
    .from("missions")
    .update({
      progress: newProgress,
    })
    .eq("id", mission.id);

  if (error) {
    alert(error.message);
    console.error(error);
    return;
  }

  const { error: xpError } = await supabase.rpc("add_xp", {
    p_user_id: user.id,
    p_amount: Math.round(totalXpChange),
  });

  if (xpError) {
    alert(xpError.message);
    console.error(xpError);
    return;
  }

if (change > 0 && mission.required_for_streak) {
  const { error: streakError } = await supabase.rpc("update_streak", {
    p_user_id: user.id,
  });

  if (streakError) {
    alert(streakError.message);
    console.error(streakError);
    return;
  }
}

await refreshMissions();
await refreshProfile();
}
  async function deleteMission(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this mission?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("missions")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      console.error(error);
      return;
    }

    await refreshMissions();
await refreshProfile();
}

  async function loadData() {
  setLoading(true);

  await supabase.rpc("reset_missions");

  await Promise.all([
    refreshMissions(),
    refreshProfile(),
  ]);

  setLoading(false);
}

  useEffect(() => {
  loadData();

  async function handleFocus() {
    await loadData();
  }

  function handleVisibility() {
    if (document.visibilityState === "visible") {
      handleFocus();
    }
  }

  window.addEventListener("focus", handleFocus);
  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    window.removeEventListener("focus", handleFocus);
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}, []);

  return (
    <AppContext.Provider
      value={{
        missions,
        profile,
        loading,
        refreshMissions,
        refreshProfile,
        updateMissionProgress,
        deleteMission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}