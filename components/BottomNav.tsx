"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Target,
  Trophy,
  Star,
} from "lucide-react";

const links = [
  {
    href: "/",
    label: "Home",
    icon: House,
  },
  {
    href: "/missions",
    label: "Missions",
    icon: Target,
  },
  {
    href: "/milestones",
    label: "Milestones",
    icon: Trophy,
  },
  {
    href: "/progress",
    label: "Progress",
    icon: Star,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md justify-around py-3">
        {links.map((link) => {
          const Icon = link.icon;

          const active =
            pathname === link.href ||
            pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 transition ${
                active
                  ? "text-emerald-400"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              <Icon size={22} />

              <span className="text-xs">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}