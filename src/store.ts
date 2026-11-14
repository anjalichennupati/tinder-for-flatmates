import type { ChatMessage, Profile, SwipeRecord, User } from "./types";
import { SEED_PROFILES } from "./seed";

const KEYS = {
  user: "ffm.user",
  swipes: "ffm.swipes",
  matches: "ffm.matches",
  seedProfiles: "ffm.candidates",
  chats: "ffm.chats",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore (private mode / quota)
  }
}

// ---- Current user ----------------------------------------------------------

export function getUser(): User | null {
  return read<User | null>(KEYS.user, null);
}

export function saveUser(user: User): void {
  write(KEYS.user, user);
}

export function createUser(mobile: string, email: string): User {
  const user: User = { id: `u_${Date.now()}`, mobile, email };
  saveUser(user);
  return user;
}

export function saveProfile(profile: Profile): void {
  const user = getUser();
  if (!user) return;
  user.profile = profile;
  saveUser(user);
}

// ---- Candidate pool (seed profiles) ---------------------------------------

export function getCandidates(): Profile[] {
  return read<Profile[]>(KEYS.seedProfiles, SEED_PROFILES);
}

// ---- Swipes & matches ------------------------------------------------------

export function getSwipes(): SwipeRecord[] {
  return read<SwipeRecord[]>(KEYS.swipes, []);
}

export function recordSwipe(record: SwipeRecord): void {
  const swipes = getSwipes().filter((s) => s.profileId !== record.profileId);
  swipes.push(record);
  write(KEYS.swipes, swipes);
}

export function getMatchIds(): string[] {
  return read<string[]>(KEYS.matches, []);
}

export function addMatch(profileId: string): void {
  const matches = getMatchIds();
  if (!matches.includes(profileId)) {
    matches.push(profileId);
    write(KEYS.matches, matches);
  }
}

// ---- Chats -----------------------------------------------------------------

type ChatMap = Record<string, ChatMessage[]>;

function getChatMap(): ChatMap {
  return read<ChatMap>(KEYS.chats, {});
}

export function getChat(profileId: string): ChatMessage[] {
  return getChatMap()[profileId] ?? [];
}

export function addChatMessage(profileId: string, msg: ChatMessage): void {
  const map = getChatMap();
  map[profileId] = [...(map[profileId] ?? []), msg];
  write(KEYS.chats, map);
}

/** Wipe everything (used by the "Start over" action). */
export function resetAll(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
