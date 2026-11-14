import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { useState } from "react";
import type { Profile, SwipeDirection } from "../types";

function socialLabel(s: number): string {
  if (s <= 33) return "Introvert";
  if (s >= 67) return "Extrovert";
  return "Ambivert";
}

export default function SwipeCard({
  profile,
  onSwipe,
}: {
  profile: Profile;
  onSwipe: (dir: SwipeDirection) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const passOpacity = useTransform(x, [-20, -120], [0, 1]);
  const [photoIdx, setPhotoIdx] = useState(0);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > 120) onSwipe("like");
    else if (info.offset.x < -120) onSwipe("pass");
  }

  const inr = (n: number) => `₹${(n / 1000).toFixed(0)}k`;

  return (
    <motion.div
      className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-black select-none cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
    >
      <img
        src={profile.photos[photoIdx]}
        alt={profile.name}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* photo tap zones */}
      {profile.photos.length > 1 && (
        <>
          <button
            className="absolute inset-y-0 left-0 w-1/2"
            onClick={() => setPhotoIdx(0)}
            aria-label="Previous photo"
          />
          <button
            className="absolute inset-y-0 right-0 w-1/2"
            onClick={() => setPhotoIdx(1)}
            aria-label="Next photo"
          />
          <div className="absolute top-3 inset-x-3 flex gap-1.5">
            {profile.photos.map((_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i === photoIdx ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* LIKE / PASS stamps */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-6 rotate-[-18deg] border-4 border-green-400 text-green-400 font-extrabold text-3xl px-3 py-1 rounded-lg"
      >
        LIKE
      </motion.div>
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-8 right-6 rotate-[18deg] border-4 border-red-400 text-red-400 font-extrabold text-3xl px-3 py-1 rounded-lg"
      >
        NOPE
      </motion.div>

      {/* info overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 pt-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white pointer-events-none">
        <div className="flex items-end gap-2">
          <h2 className="text-2xl font-extrabold">{profile.name}</h2>
          <span className="text-xl font-light opacity-90">{profile.age}</span>
          <span className="text-xs opacity-70 mb-1">· {profile.gender}</span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm opacity-90">
          <span>📍 {profile.areas.join(", ")}</span>
          <span>💸 {inr(profile.budgetMin)}–{inr(profile.budgetMax)}/mo</span>
          <span>👥 wants {profile.roommates} flatmate{profile.roommates > 1 ? "s" : ""}</span>
          <span>🧭 {socialLabel(profile.social)}</span>
        </div>

        {profile.bio && <p className="mt-2 text-sm opacity-90">{profile.bio}</p>}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.traits.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/20 backdrop-blur px-2.5 py-1 text-xs"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
