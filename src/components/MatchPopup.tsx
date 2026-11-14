import { motion } from "framer-motion";
import type { Profile } from "../types";

export default function MatchPopup({
  me,
  them,
  onClose,
  onGoToMatches,
  onMessage,
}: {
  me: Profile;
  them: Profile;
  onClose: () => void;
  onGoToMatches: () => void;
  onMessage: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-extrabold text-brand drop-shadow">It's a match!</h2>
        <p className="text-white/80 mt-1">
          You and {them.name} liked each other.
        </p>

        <div className="mt-6 flex items-center justify-center -space-x-4">
          <img
            src={me.photos[0]}
            alt="you"
            className="h-28 w-28 rounded-full object-cover border-4 border-brand"
          />
          <img
            src={them.photos[0]}
            alt={them.name}
            className="h-28 w-28 rounded-full object-cover border-4 border-white"
          />
        </div>

        <div className="mt-8 space-y-3 w-64 mx-auto">
          <button
            onClick={onMessage}
            className="w-full rounded-full bg-brand text-white font-semibold py-3"
          >
            Send a message
          </button>
          <button
            onClick={onGoToMatches}
            className="w-full rounded-full border border-white/40 text-white py-3"
          >
            See all matches
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-full text-white/80 py-2 text-sm"
          >
            Keep swiping
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
