import type { DiscoverFilters, Profile } from "../types";

/** Two [min,max] ranges overlap if each starts at or before the other ends. */
export function budgetOverlaps(a: Profile, b: Profile): boolean {
  return a.budgetMin <= b.budgetMax && b.budgetMin <= a.budgetMax;
}

/** Default filters derived from the user's own profile (no extra narrowing). */
export function defaultFilters(me: Profile): DiscoverFilters {
  return { genders: [], areas: [], budgetMin: me.budgetMin, budgetMax: me.budgetMax };
}

/** True if the two profiles share at least one area. */
export function areaOverlaps(a: Profile, b: Profile): boolean {
  return a.areas.some((area) => b.areas.includes(area));
}

/**
 * Base eligibility: a candidate must have a budget overlapping the user's AND
 * share at least one area with them. On top of that, the user's own discovery
 * filters (gender, area subset, budget range) narrow the deck further.
 */
export function filterCandidates(
  me: Profile,
  candidates: Profile[],
  filters?: DiscoverFilters
): Profile[] {
  return candidates.filter((c) => {
    if (c.id === me.id) return false;
    // Base constraints (always applied).
    if (!budgetOverlaps(me, c) || !areaOverlaps(me, c)) return false;
    if (!filters) return true;

    // Gender filter (empty = everyone).
    if (filters.genders.length > 0 && !filters.genders.includes(c.gender)) {
      return false;
    }
    // Area filter: candidate must be in at least one of the selected areas.
    if (filters.areas.length > 0 && !c.areas.some((a) => filters.areas.includes(a))) {
      return false;
    }
    // Budget filter: candidate's range must overlap the chosen range.
    if (c.budgetMin > filters.budgetMax || filters.budgetMin > c.budgetMax) {
      return false;
    }
    return true;
  });
}

/** Count how many filters differ from the no-narrowing defaults, for a badge. */
export function activeFilterCount(f: DiscoverFilters, me: Profile): number {
  let n = 0;
  if (f.genders.length > 0) n++;
  if (f.areas.length > 0) n++;
  if (f.budgetMin !== me.budgetMin || f.budgetMax !== me.budgetMax) n++;
  return n;
}
