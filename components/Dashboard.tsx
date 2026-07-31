"use client";

import Header from "./Header";
import ProgressCard from "./ProgressCard";
import MessageCard from "./MessageCard";
import StatsGrid from "./StatsGrid";
import MissionList from "./MissionList";

import { useApp } from "@/context/AppContext";
import { getChallengeInfo } from "@/utils/challenge";
import { getLevel } from "@/utils/levels";

export default function Dashboard() {
  const { missions, profile, loading } = useApp();

  const challenge = getChallengeInfo();

  const totalXP = profile?.total_xp ?? 0;
  const level = getLevel(totalXP);
  const streak = profile?.current_streak ?? 0;

  let title = "TODAY'S MESSAGE";
  let message =
    "One decision won't change your life. 153 days of the right decisions will.";

  if (challenge.status === "before") {
    title = "CHALLENGE STARTS SOON";
    message = `${challenge.countdown} day${
      challenge.countdown === 1 ? "" : "s"
    } until 153% begins. Prepare yourself.`;
  }

  if (challenge.status === "complete") {
    title = "CHALLENGE COMPLETE";
    message =
      "Congratulations. You completed the 153% challenge.";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400 text-xl">
          Loading your journey...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-md px-6 py-8">

        <Header />

        <ProgressCard
          day={challenge.day}
          totalDays={challenge.totalDays}
        />

        <MessageCard
          title={title}
          message={message}
        />

        <StatsGrid
          xp={totalXP}
          level={level}
          streak={streak}
        />

        <MissionList
          missions={missions}
        />

      </div>
    </main>
  );
}