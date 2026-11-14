import { useEffect, useRef, useState } from "react";
import { addChatMessage, getChat } from "../store";
import type { ChatMessage, Profile } from "../types";

/** Canned replies the matched flatmate sends back, picked in order then cycled. */
const AUTO_REPLIES = [
  "Hey! Thanks for the like 😊",
  "Yeah I'm still looking for a place — what areas are you set on?",
  "Nice, that works for my budget too. When are you planning to move?",
  "Cool! Want to hop on a call this week to figure out the details?",
  "Sounds good — I'll ping you my number 👍",
];

function newMsg(from: ChatMessage["from"], text: string): ChatMessage {
  return { id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, from, text, at: Date.now() };
}

export default function Chat({
  match,
  onBack,
}: {
  match: Profile;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => getChat(match.id));
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const mine = newMsg("me", text);
    addChatMessage(match.id, mine);
    setMessages((m) => [...m, mine]);
    setDraft("");

    // Simulate the flatmate typing and replying.
    const replyIdx = messages.filter((m) => m.from === "them").length % AUTO_REPLIES.length;
    setTyping(true);
    setTimeout(() => {
      const reply = newMsg("them", AUTO_REPLIES[replyIdx]);
      addChatMessage(match.id, reply);
      setMessages((m) => [...m, reply]);
      setTyping(false);
    }, 1100);
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#eef0fc] dark:bg-[#121327]">
      {/* header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 backdrop-blur">
        <button onClick={onBack} className="text-xl px-1" aria-label="Back">
          ←
        </button>
        <img
          src={match.photos[0]}
          alt={match.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold leading-tight">{match.name}</div>
          <div className="text-xs opacity-60">📍 {match.areas[0]}</div>
        </div>
      </header>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-md space-y-2">
          <p className="text-center text-xs opacity-50 mb-2">
            You matched with {match.name}. Say hello! 👋
          </p>
          {messages.map((m) => (
            <Bubble key={m.id} mine={m.from === "me"}>
              {m.text}
            </Bubble>
          ))}
          {typing && (
            <Bubble mine={false}>
              <span className="inline-flex gap-1 py-1">
                <Dot /> <Dot /> <Dot />
              </span>
            </Bubble>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* composer */}
      <div className="p-3 border-t border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 backdrop-blur">
        <div className="mx-auto max-w-md flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Message ${match.name}…`}
            className="flex-1 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-4 py-2.5 outline-none text-sm"
          />
          <button
            onClick={send}
            disabled={!draft.trim()}
            className="h-11 w-11 rounded-full bg-brand text-white text-lg disabled:opacity-40 active:scale-90 transition"
            aria-label="Send"
          >
            ➤
          </button>
        </div>
      </div>
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

function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50 animate-pulse" />;
}
