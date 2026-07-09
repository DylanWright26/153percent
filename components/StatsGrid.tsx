interface StatsGridProps {
  xp: number;
  level: number;
  streak: number;
}

export default function StatsGrid({
  xp,
  level,
  streak,
}: StatsGridProps) {
  const stats = [
    {
      icon: "⭐",
      label: "XP",
      value: xp,
    },
    {
      icon: "🏆",
      label: "Level",
      value: level,
    },
    {
      icon: "🔥",
      label: "Streak",
      value: streak,
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl bg-zinc-900 p-5 text-center"
        >
          <p className="text-3xl">{stat.icon}</p>

          <h3 className="mt-2 text-2xl font-bold">
            {stat.value}
          </h3>

          <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}