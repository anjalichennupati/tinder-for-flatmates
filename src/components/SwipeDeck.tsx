import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getDeck, recordSwipe, type Match } from "../api";
import { filterCandidates } from "../lib/filtering";
import type { DiscoverFilters, Profile, SwipeDirection } from "../types";
import SwipeCard from "./SwipeCard";

export default function SwipeDeck({
  me,
  filters,
  onMatch,
}: {
  me: Profile;
  filters: DiscoverFilters;
  onMatch: (match: Match) => void;
}) {
  // The server returns everyone whose budget AND area overlap yours; the softer filters apply here.
  const [deck, setDeck] = useState<Profile[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getDeck()
      .then((candidates) => setDeck(filterCandidates(me, candidates, filters)))
      .catch((e: Error) => setError(e.message));
    // The deck is remounted (keyed) when the profile or filters change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [index, setIndex] = useState(0);

  function swipe(dir: SwipeDirection) {
    const current = deck?.[index];
    if (!current) return;
    setIndex((i) => i + 1);
    recordSwipe(current.id, dir)
      .then(({ match }) => match && onMatch(match))
      .catch((e: Error) => setError(e.message));
  }

  if (error || !deck) {
    return (
      <div className="mx-auto w-full max-w-md px-5 py-16 text-center text-sm opacity-70">
        {error ? `Something went wrong: ${error}` : "Finding flatmates…"}
      </div>
    );
  }

  const remaining = deck.slice(index, index + 2).reverse();
  const done = index >= deck.length;

  return (
    <div className="mx-auto w-full max-w-md px-5 py-4">
      <div className="relative mx-auto aspect-[3/4] w-full">
        {done ? (
          <EmptyState />
        ) : (
          <AnimatePresence>
            {remaining.map((profile, i) => {
              const isTop = i === remaining.length - 1;
              return (
                <motion.div
                  key={profile.id}
                  className="absolute inset-0"
                  initial={{ scale: 0.95, y: 12 }}
                  animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 12 }}
                  exit={{ opacity: 0 }}
                  style={{ zIndex: i }}
                >
                  {isTop ? (
                    <SwipeCard profile={profile} onSwipe={swipe} />
                  ) : (
                    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl bg-black">
                      <img
                        src={profile.photos[0]}
                        alt=""
                        className="h-full w-full object-cover opacity-90"
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {!done && (
        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            onClick={() => swipe("pass")}
            className="h-16 w-16 rounded-full bg-white dark:bg-white/10 shadow-lg text-2xl text-red-500 active:scale-90 transition"
            aria-label="Pass"
          >
            ✕
          </button>
          <button
            onClick={() => swipe("like")}
            className="h-16 w-16 rounded-full bg-white dark:bg-white/10 shadow-lg text-2xl text-green-500 active:scale-90 transition"
            aria-label="Like"
          >
            ♥
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="absolute inset-0 rounded-3xl border border-dashed border-black/15 dark:border-white/20 flex flex-col items-center justify-center text-center px-6">
      <div className="text-4xl mb-3">🎉</div>
      <h3 className="font-semibold text-lg">You're all caught up!</h3>
      <p className="text-sm opacity-70 mt-1">
        No more flatmates match right now. Try widening your filters (gender, budget
        or area) or check back later.
      </p>
    </div>
  );
}
