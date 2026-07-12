import Link from "next/link";
import { CircleUserRound } from "lucide-react";

export default function Header() {
  return (
    <header className="relative text-center">

      <Link
        href="/account"
        className="absolute right-0 top-0 rounded-full p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
      >
        <CircleUserRound size={28} />
      </Link>

      <h1 className="text-6xl font-black tracking-tight">
        153%
      </h1>

      <p className="mt-3 text-lg text-zinc-400">
        Getting 1% Better, Every Day
      </p>

      <p className="mt-6 text-xs uppercase tracking-[0.35em] text-zinc-500">
        August 1st → December 31st
      </p>

    </header>
  );
}