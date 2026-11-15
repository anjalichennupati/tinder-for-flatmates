import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import OnboardingRegister from "./components/OnboardingRegister";
import ProfileSetup from "./components/ProfileSetup";
import SwipeDeck from "./components/SwipeDeck";
import Matches from "./components/Matches";
import MatchPopup from "./components/MatchPopup";
import Chat from "./components/Chat";
import FilterSheet from "./components/FilterSheet";
import NavBar, { type Tab } from "./components/NavBar";
import { activeFilterCount, defaultFilters } from "./lib/filtering";
import { getMatches, getMe, logout, saveProfile, type Match } from "./api";
import type { DiscoverFilters, Profile, User } from "./types";

type Screen = "register" | "setup" | "app";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<Tab>("discover");
  const [matched, setMatched] = useState<Match | null>(null);
  const [chatWith, setChatWith] = useState<Match | null>(null);
  const [filters, setFilters] = useState<DiscoverFilters | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  // deckKey remounts the deck after a profile edit so filters re-apply.
  const [deckKey, setDeckKey] = useState(0);

  // Restore the session (if any) from the API.
  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((e: Error) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Keep the nav badge in sync with the server.
  useEffect(() => {
    if (user?.profile) getMatches().then((m) => setMatchCount(m.length)).catch(() => undefined);
  }, [user?.profile, matched]);

  const screen: Screen = !user
    ? "register"
    : !user.profile || editing
    ? "setup"
    : "app";

  function handleRegistered(u: User) {
    setUser(u);
  }

  async function handleSaveProfile(profile: Profile) {
    const saved = await saveProfile(profile, user?.profile);
    setUser({ ...(user as User), profile: saved });
    setEditing(false);
    setDeckKey((k) => k + 1);
    setTab("discover");
  }

  function handleMatch(match: Match) {
    setMatched(match);
  }

  async function startOver() {
    await logout();
    setUser(null);
    setMatched(null);
    setChatWith(null);
    setFilters(null);
    setShowFilters(false);
    setMatchCount(0);
    setEditing(false);
    setTab("discover");
  }

  if (loading || loadError) {
    return (
      <div className="min-h-full flex items-center justify-center px-5 text-center text-sm opacity-70">
        {loadError ? `Couldn't reach the server: ${loadError}` : "Loading…"}
      </div>
    );
  }

  if (screen === "register") {
    return <OnboardingRegister onDone={handleRegistered} />;
  }

  if (screen === "setup") {
    return (
      <ProfileSetup
        userId={user!.id}
        initial={editing ? user!.profile : undefined}
        onSave={handleSaveProfile}
      />
    );
  }

  const me = user!.profile!;
  const effectiveFilters = filters ?? defaultFilters(me);
  const filterCount = activeFilterCount(effectiveFilters, me);
  // Serialize filters so the deck remounts (and re-filters) when they change.
  const filterKey = JSON.stringify(effectiveFilters);

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-black/50 backdrop-blur border-b border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-brand">FlatMate</h1>
          {tab === "discover" ? (
            <button
              onClick={() => setShowFilters(true)}
              className="relative flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 px-3 py-1.5 text-sm font-medium active:scale-95 transition"
            >
              <span>⚙️</span> Filters
              {filterCount > 0 && (
                <span className="ml-0.5 h-5 min-w-5 px-1 rounded-full bg-brand text-white text-xs leading-5 text-center">
                  {filterCount}
                </span>
              )}
            </button>
          ) : (
            <span className="text-xs opacity-60">Bangalore 🏙️</span>
          )}
        </div>
      </header>

      <main className="flex-1">
        {tab === "discover" && (
          <SwipeDeck
            key={`${deckKey}-${filterKey}`}
            me={me}
            filters={effectiveFilters}
            onMatch={handleMatch}
          />
        )}
        {tab === "matches" && (
          <Matches
            onStartSwiping={() => setTab("discover")}
            onOpenChat={(p) => setChatWith(p)}
          />
        )}
        {tab === "profile" && (
          <div className="mx-auto w-full max-w-md px-5 py-6">
            <div className="rounded-3xl overflow-hidden bg-white dark:bg-white/5 shadow">
              <div className="aspect-[3/4] bg-black">
                <img src={me.photos[0]} alt={me.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold">
                  {me.name}, {me.age}
                </h2>
                <p className="text-sm opacity-70">{me.gender}</p>
                <div className="mt-3 text-sm space-y-1">
                  <p>📍 {me.areas.join(", ")}</p>
                  <p>💸 ₹{me.budgetMin.toLocaleString("en-IN")} – ₹{me.budgetMax.toLocaleString("en-IN")} / month</p>
                  <p>👥 {me.roommates} flatmate{me.roommates > 1 ? "s" : ""}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {me.traits.map((t) => (
                    <span key={t} className="rounded-full bg-brand/10 text-brand px-2.5 py-1 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="mt-4 w-full rounded-full bg-brand text-white font-semibold py-3"
            >
              Edit profile
            </button>
            <button
              onClick={startOver}
              className="mt-3 w-full rounded-full border border-black/15 dark:border-white/20 py-3 text-sm opacity-80"
            >
              Log out
            </button>
          </div>
        )}
      </main>

      <NavBar tab={tab} onChange={setTab} matchCount={matchCount} />

      <AnimatePresence>
        {matched && (
          <MatchPopup
            me={me}
            them={matched.profile}
            onClose={() => setMatched(null)}
            onGoToMatches={() => {
              setMatched(null);
              setTab("matches");
            }}
            onMessage={() => {
              const them = matched;
              setMatched(null);
              setTab("matches");
              setChatWith(them);
            }}
          />
        )}
      </AnimatePresence>

      {chatWith && <Chat match={chatWith} myId={user!.id} onBack={() => setChatWith(null)} />}

      <AnimatePresence>
        {showFilters && (
          <FilterSheet
            me={me}
            current={effectiveFilters}
            onClose={() => setShowFilters(false)}
            onApply={(f) => {
              setFilters(f);
              setShowFilters(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
