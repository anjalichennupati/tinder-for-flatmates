import { getCandidates, getMatchIds } from "../store";
import type { Profile } from "../types";

export default function Matches({
  onStartSwiping,
  onOpenChat,
}: {
  onStartSwiping: () => void;
  onOpenChat: (profile: Profile) => void;
}) {
  const ids = getMatchIds();
  const byId = new Map(getCandidates().map((c) => [c.id, c]));
  const matches = ids.map((id) => byId.get(id)).filter(Boolean) as Profile[];

  return (
    <div className="mx-auto w-full max-w-md px-5 py-6">
      <h1 className="text-2xl font-extrabold mb-1">Your matches</h1>
      <p className="text-sm opacity-70 mb-5">
        {matches.length === 0
          ? "No matches yet — keep swiping!"
          : `${matches.length} flatmate${matches.length > 1 ? "s" : ""} liked you back.`}
      </p>

      {matches.length === 0 ? (
        <button
          onClick={onStartSwiping}
          className="w-full rounded-full bg-brand text-white font-semibold py-3"
        >
          Start swiping
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {matches.map((m) => (
            <button
              key={m.id}
              onClick={() => onOpenChat(m)}
              className="text-left rounded-2xl overflow-hidden bg-white dark:bg-white/5 shadow active:scale-[0.98] transition"
            >
              <div className="aspect-square bg-black">
                <img src={m.photos[0]} alt={m.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <div className="font-semibold">
                  {m.name}, {m.age}
                </div>
                <div className="text-xs opacity-70">📍 {m.areas[0]}</div>
                <span className="mt-2 inline-block text-xs font-medium text-brand">
                  Say hi 👋
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
