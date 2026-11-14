export type Tab = "discover" | "matches" | "profile";

export default function NavBar({
  tab,
  onChange,
  matchCount,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  matchCount: number;
}) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: "discover", label: "Discover", icon: "🔥" },
    { id: "matches", label: "Matches", icon: "💬" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="sticky bottom-0 z-20 border-t border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/60 backdrop-blur">
      <div className="mx-auto max-w-md flex">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={`relative flex-1 py-2.5 flex flex-col items-center text-xs ${
              tab === it.id ? "text-brand font-semibold" : "opacity-60"
            }`}
          >
            <span className="text-xl leading-none">{it.icon}</span>
            {it.label}
            {it.id === "matches" && matchCount > 0 && (
              <span className="absolute top-1.5 right-1/2 translate-x-4 h-4 min-w-4 px-1 rounded-full bg-brand text-white text-[10px] leading-4 text-center">
                {matchCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
