import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveQuery } from "@neon/realtime-react";
import type { SealedLiveQuery } from "@neon/realtime/client";
import { fetchSealedMessages, sendMessage, type Match, type MessageRow } from "../api";

/** Fetches the sealed live query for a match; the Chat renders once it has one. */
export default function Chat({
  match,
  myId,
  onBack,
}: {
  match: Match;
  myId: string;
  onBack: () => void;
}) {
  const [sealed, setSealed] = useState<SealedLiveQuery<MessageRow>>();
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    fetchSealedMessages(match.matchId).then(
      (q) => !cancelled && setSealed(q),
      (e: Error) => !cancelled && setError(e.message)
    );
    return () => {
      cancelled = true;
    };
  }, [match.matchId]);

  return (
    <ChatShell match={match} onBack={onBack}>
      {sealed ? (
        <LiveChat match={match} myId={myId} sealed={sealed} />
      ) : (
        <p className="flex-1 p-6 text-center text-sm opacity-60">
          {error ? `Couldn't open chat: ${error}` : "Opening chat…"}
        </p>
      )}
    </ChatShell>
  );
}

function LiveChat({
  match,
  myId,
  sealed,
}: {
  match: Match;
  myId: string;
  sealed: SealedLiveQuery<MessageRow>;
}) {
  const refreshQuery = useCallback(() => fetchSealedMessages(match.matchId), [match.matchId]);
  const { data, status, error, utils } = useLiveQuery(sealed, { refreshQuery });
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const them = match.profile;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.length]);

  async function send() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setSendError("");
    try {
      const { txid } = await sendMessage(match.matchId, text);
      setDraft("");
      // Wait for our own write to arrive on the live query, so it never "jumps" in late.
      await utils.awaitTxId(txid, 10_000).catch(() => undefined);
    } catch (e) {
      setSendError((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-md space-y-2">
          <p className="text-center text-xs opacity-50 mb-2">
            You matched with {them.name}. Say hello! 👋
          </p>
          {status === "error" && (
            <p role="alert" className="text-center text-xs text-red-500">
              Live updates stopped: {error?.message}
            </p>
          )}
          {data === undefined && status !== "error" && (
            <p className="text-center text-xs opacity-50">Loading messages…</p>
          )}
          {data?.map((m) => (
            <Bubble key={m.id} mine={m.sender_id === myId}>
              {m.body}
            </Bubble>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <div className="p-3 border-t border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 backdrop-blur">
        {sendError && <p className="mx-auto max-w-md pb-2 text-xs text-red-500">{sendError}</p>}
        <div className="mx-auto max-w-md flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Message ${them.name}…`}
            className="flex-1 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-4 py-2.5 outline-none text-sm"
          />
          <button
            onClick={send}
            disabled={!draft.trim() || sending}
            className="h-11 w-11 rounded-full bg-brand text-white text-lg disabled:opacity-40 active:scale-90 transition"
            aria-label="Send"
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}

function ChatShell({
  match,
  onBack,
  children,
}: {
  match: Match;
  onBack: () => void;
  children: React.ReactNode;
}) {
  const them = match.profile;
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#eef0fc] dark:bg-[#121327]">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 backdrop-blur">
        <button onClick={onBack} className="text-xl px-1" aria-label="Back">
          ←
        </button>
        <img src={them.photos[0]} alt={them.name} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <div className="font-semibold leading-tight">{them.name}</div>
          <div className="text-xs opacity-60">📍 {them.areas[0]}</div>
        </div>
      </header>
      {children}
    </div>
  );
}
function Bubble({ mine, children }: { mine: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
          mine
            ? "bg-brand text-white rounded-br-sm"
            : "bg-white dark:bg-white/10 rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
