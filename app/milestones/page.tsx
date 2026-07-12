export default function MilestonesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-24">
      <div className="mx-auto max-w-md px-6 py-8">

        <h1 className="text-4xl font-bold">
          🏆 Milestones
        </h1>

        <p className="mt-2 text-zinc-500">
          Long-term goals that define your journey.
        </p>

        <div className="mt-8 rounded-3xl bg-zinc-900 p-6">

          <h2 className="text-xl font-semibold">
            Coming Soon
          </h2>

          <p className="mt-3 text-zinc-400 leading-relaxed">
            Milestones are your biggest goals.
            Unlike missions, they don't reset.
          </p>

          <div className="mt-6 space-y-3">

            <div className="rounded-xl bg-zinc-800 p-4">
              🏃 Run a 5K under 28:00
            </div>

            <div className="rounded-xl bg-zinc-800 p-4">
              💪 Bench Press 100kg
            </div>

            <div className="rounded-xl bg-zinc-800 p-4">
              💰 Save £5,000
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}