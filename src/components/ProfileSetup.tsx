import { useRef, useState } from "react";
import {
  BANGALORE_AREAS,
  PERSONALITY_TRAITS,
  type Area,
  type Gender,
  type Profile,
  type Trait,
} from "../types";

const GENDERS: Gender[] = ["Female", "Male", "Non-binary"];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfileSetup({
  userId,
  initial,
  onSave,
}: {
  userId: string;
  initial?: Profile;
  onSave: (profile: Profile) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [age, setAge] = useState(initial?.age ?? 25);
  const [gender, setGender] = useState<Gender>(initial?.gender ?? "Female");
  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);
  const [areas, setAreas] = useState<Area[]>(initial?.areas ?? []);
  const [budgetMin, setBudgetMin] = useState(initial?.budgetMin ?? 15000);
  const [budgetMax, setBudgetMax] = useState(initial?.budgetMax ?? 25000);
  const [roommates, setRoommates] = useState(initial?.roommates ?? 1);
  const [social, setSocial] = useState(initial?.social ?? 50);
  const [traits, setTraits] = useState<Trait[]>(initial?.traits ?? []);
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPickPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 2 - photos.length);
    const urls = await Promise.all(files.map(readFileAsDataUrl));
    setPhotos((p) => [...p, ...urls].slice(0, 2));
    if (fileRef.current) fileRef.current.value = "";
  }

  function toggleArea(a: Area) {
    setAreas((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));
  }

  function toggleTrait(t: Trait) {
    setTraits((cur) =>
      cur.includes(t) ? cur.filter((x) => x !== t) : cur.length < 6 ? [...cur, t] : cur
    );
  }

  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim()) return setError("Please add your name.");
    if (photos.length < 2) return setError("Please add 2 photos.");
    if (areas.length === 0) return setError("Pick at least one area.");
    if (budgetMin > budgetMax) return setError("Min budget can't exceed max budget.");
    setError("");
    setSaving(true);
    await onSave({
      id: userId,
      name: name.trim(),
      age,
      gender,
      photos,
      areas,
      budgetMin,
      budgetMax,
      roommates,
      social,
      traits,
      bio: bio.trim() || undefined,
    })
      .catch((e: Error) => setError(e.message))
      .finally(() => setSaving(false));
  }

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="mx-auto w-full max-w-md px-5 py-6 pb-28">
      <h1 className="text-2xl font-extrabold">
        {initial ? "Edit your profile" : "Set up your profile"}
      </h1>
      <p className="text-sm opacity-70 mb-6">This is what potential flatmates will see.</p>

      {/* Photos */}
      <Section title="Two photos">
        <div className="flex gap-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="relative aspect-[3/4] flex-1 rounded-2xl overflow-hidden border border-dashed border-black/15 dark:border-white/20 bg-white/60 dark:bg-white/5 flex items-center justify-center"
            >
              {photos[i] ? (
                <>
                  <img src={photos[i]} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white text-sm"
                    aria-label="Remove photo"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <span className="text-xs opacity-50">Empty</span>
              )}
            </div>
          ))}
        </div>
        {photos.length < 2 && (
          <>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-3 w-full rounded-full border border-brand text-brand font-medium py-2.5 text-sm"
            >
              + Upload photo{photos.length === 0 ? "s" : ""}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={onPickPhotos}
            />
          </>
        )}
      </Section>

      {/* Name */}
      <Section title="Name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name"
          className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2.5 outline-none text-sm"
        />
      </Section>

      {/* Age + gender */}
      <Section title={`Age: ${age}`}>
        <input
          type="range"
          min={18}
          max={60}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="w-full accent-brand"
        />
        <div className="mt-3 flex gap-2">
          {GENDERS.map((g) => (
            <Chip key={g} active={gender === g} onClick={() => setGender(g)}>
              {g}
            </Chip>
          ))}
        </div>
      </Section>

      {/* Area */}
      <Section title="Areas you're looking in">
        <div className="flex flex-wrap gap-2">
          {BANGALORE_AREAS.map((a) => (
            <Chip key={a} active={areas.includes(a)} onClick={() => toggleArea(a)}>
              {a}
            </Chip>
          ))}
        </div>
      </Section>

      {/* Budget */}
      <Section title={`Budget: ${inr(budgetMin)} – ${inr(budgetMax)} / month`}>
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
          className="w-full accent-brand"
        />
      </Section>

      {/* Roommates */}
      <Section title="Number of flatmates you want">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <Chip key={n} active={roommates === n} onClick={() => setRoommates(n)}>
              {n}
            </Chip>
          ))}
        </div>
      </Section>

      {/* Social style */}
      <Section title="Your social style">
        <input
          type="range"
          min={0}
          max={100}
          value={social}
          onChange={(e) => setSocial(Number(e.target.value))}
          className="w-full accent-brand"
        />
        <div className="flex justify-between text-xs opacity-60 mt-1">
          <span>🤫 Introvert</span>
          <span>Extrovert 🎉</span>
        </div>
      </Section>

      {/* Traits */}
      <Section title={`Personality traits (${traits.length}/6)`}>
        <div className="flex flex-wrap gap-2">
          {PERSONALITY_TRAITS.map((t) => (
            <Chip key={t} active={traits.includes(t)} onClick={() => toggleTrait(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </Section>

      {/* Bio */}
      <Section title="A little about you (optional)">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={160}
          placeholder="e.g. Early riser, love cooking, work from home 3 days a week."
          className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2.5 outline-none text-sm resize-none"
        />
      </Section>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <div className="fixed bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/10 to-transparent dark:from-black/40">
        <button
          onClick={submit}
          disabled={saving}
          className="mx-auto block w-full max-w-md rounded-full bg-brand text-white font-semibold py-3.5 shadow-lg active:scale-[0.98] transition disabled:opacity-60"
        >
          {saving ? "Saving…" : initial ? "Save changes" : "Start swiping"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      {children}
    </div>
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
