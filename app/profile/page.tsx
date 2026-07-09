import Link from "next/link";
import { ChevronRight } from "lucide-react";

const items = [
  {
    title: "Missions",
    description: "Manage your daily missions",
    href: "/profile/missions",
    icon: "🎯",
  },
  {
    title: "Categories",
    description: "Organise your missions",
    href: "/profile/categories",
    icon: "📂",
  },
  {
    title: "Rewards",
    description: "Create your own rewards",
    href: "/profile/rewards",
    icon: "🎁",
  },
  {
    title: "Achievements",
    description: "Build custom milestones",
    href: "/profile/achievements",
    icon: "🏆",
  },
  {
    title: "Settings",
    description: "Challenge settings",
    href: "/profile/settings",
    icon: "⚙️",
  },
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-24">
      <div className="mx-auto max-w-md px-6 py-8">

        <h1 className="text-4xl font-bold">
          👤 Profile
        </h1>

        <p className="mt-2 text-zinc-500">
          Your personal control centre.
        </p>

        <div className="mt-8 rounded-3xl overflow-hidden bg-zinc-900">

          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center justify-between border-b border-zinc-800 p-5 hover:bg-zinc-800 transition"
            >
              <div>

                <h2 className="font-semibold text-lg">
                  {item.icon} {item.title}
                </h2>

                <p className="text-sm text-zinc-500">
                  {item.description}
                </p>

              </div>

              <ChevronRight className="text-zinc-500" />
            </Link>
          ))}

        </div>

      </div>
    </main>
  );
}