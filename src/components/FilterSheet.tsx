import { useState } from "react";
import { motion } from "framer-motion";
import { defaultFilters } from "../lib/filtering";
import type { Area, DiscoverFilters, Gender, Profile } from "../types";

const GENDERS: Gender[] = ["Female", "Male", "Non-binary"];

export default function FilterSheet({
  me,
  current,
  onApply,
  onClose,
}: {
  me: Profile;
  current: DiscoverFilters;
  onApply: (filters: DiscoverFilters) => void;
  onClose: () => void;
}) {
  const [genders, setGenders] = useState<Gender[]>(current.genders);
  const [areas, setAreas] = useState<Area[]>(current.areas);
  const [budgetMin, setBudgetMin] = useState(current.budgetMin);
  const [budgetMax, setBudgetMax] = useState(current.budgetMax);

  function toggle<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
  }

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  function apply() {
    onApply({
      genders,
      areas,
      budgetMin: Math.min(budgetMin, budgetMax),
      budgetMax: Math.max(budgetMin, budgetMax),
    });
  }

  function reset() {
    const d = defaultFilters(me);
    setGenders(d.genders);
    setAreas(d.areas);
    setBudgetMin(d.budgetMin);
    setBudgetMax(d.budgetMax);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="relative w-full max-w-md rounded-t-3xl bg-white dark:bg-[#1b1d33] p-5 pb-8 max-h-[85vh] overflow-y-auto"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-black/15 dark:bg-white/20" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Filters</h2>
          <button onClick={reset} className="text-sm text-brand font-medium">
            Reset
          </button>
        </div>

        {/* Gender */}
        <h3 className="text-sm font-semibold mb-2">Gender</h3>
        <div className="flex flex-wrap gap-2 mb-5">
          {GENDERS.map((g) => (
            <Chip key={g} active={genders.includes(g)} onClick={() => setGenders((l) => toggle(l, g))}>
              {g}
            </Chip>
          ))}
          <span className="self-center text-xs opacity-50">
            {genders.length === 0 ? "Showing everyone" : ""}
          </span>
        </div>

        {/* Budget */}
        <h3 className="text-sm font-semibold mb-1">
          Budget: {inr(budgetMin)} – {inr(budgetMax)} / month
        </h3>
        <label className="text-xs opacity-60">Minimum</label>
        <input
          type="range"
          min={5000}
          max={60000}
          step={1000}
          value={budgetMin}
          onChange={(e) => setBudgetMin(Number(e.target.value))}
          className="w-full accent-brand"
        />
        <label className="text-xs opacity-60">Maximum</label>
        <input
          type="range"
          min={5000}
          max={60000}
          step={1000}
          value={budgetMax}
          onChange={(e) => setBudgetMax(Number(e.target.value))}
          className="w-full accent-brand mb-5"
        />

        {/* Area */}
        <h3 className="text-sm font-semibold mb-2">Areas</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {me.areas.map((a) => (
            <Chip key={a} active={areas.includes(a)} onClick={() => setAreas((l) => toggle(l, a))}>
              {a}
            </Chip>
          ))}
          {areas.length === 0 && (
            <span className="self-center text-xs opacity-50">All your areas</span>
          )}
        </div>

        <button
          onClick={apply}
          className="w-full rounded-full bg-brand text-white font-semibold py-3.5 active:scale-[0.98] transition"
        >
          Show flatmates
        </button>
      </motion.div>
    </motion.div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm border transition ${
        active
          ? "bg-brand text-white border-brand"
          : "bg-white/70 dark:bg-white/5 border-black/10 dark:border-white/15"
      }`}
    >
      {children}
    </button>
  );
}
