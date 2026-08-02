"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import BackButton from "@/components/common/BackButton";

const items = [
  {
    title: "Achievements",
    description: "View your unlocked achievements",
    href: "/account/achievements",
    icon: "🏆",
  },
  {
    title: "Settings",
    description: "Manage your account",
    href: "/account/settings",
    icon: "⚙️",
  },
];

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pb-24 text-white">

      <div className="mx-auto max-w-md px-6 py-8">

        <BackButton href="/" />

        <h1 className="text-4xl font-bold">
          👤 Account
        </h1>

        <p className="mt-2 text-zinc-500">
          Your personal control centre.
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl bg-zinc-900">

          {items.map((item) => (

            <Link
              key={item.title}
              href={item.href}
              className="flex items-center justify-between border-b border-zinc-800 p-5 transition hover:bg-zinc-800 last:border-b-0"
            >

              <div>

                <h2 className="text-lg font-semibold">
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