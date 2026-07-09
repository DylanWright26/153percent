interface MessageCardProps {
  title: string;
  message: string;
}

export default function MessageCard({
  title,
  message,
}: MessageCardProps) {
  return (
    <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

      <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
        {title}
      </p>

      <p className="mt-4 text-xl italic leading-8 text-zinc-200">
        {message}
      </p>

    </div>
  );
}