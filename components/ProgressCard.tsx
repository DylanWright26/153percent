interface ProgressCardProps {
  day: number;
  totalDays: number;
}

export default function ProgressCard({
  day,
  totalDays,
}: ProgressCardProps) {
  const percentage = Math.round((day / totalDays) * 100);

  return (
    <div className="mt-8 rounded-3xl bg-zinc-900 p-6 shadow-lg">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-zinc-400">
            Day
          </p>

          <h2 className="mt-1 text-4xl font-bold">
            {day} / {totalDays}
          </h2>
        </div>

        <div className="text-right">
          <p className="text-sm text-zinc-400">
            Progress
          </p>

          <h2 className="text-3xl font-bold text-emerald-400">
            {percentage}%
          </h2>
        </div>

      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-4 text-sm text-zinc-500">
        August 1st → December 31st
      </p>

    </div>
  );
}