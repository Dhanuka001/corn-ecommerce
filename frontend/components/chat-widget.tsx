"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
};

const initialMessages: Message[] = [
  {
    id: "1",
    role: "user",
    text: "Hi, how long does express shipping take?",
  },
  {
    id: "2",
    role: "bot",
    text: "Hey! Express usually arrives in 1-2 business days to most cities.",
  },
  {
    id: "3",
    role: "user",
    text: "Great. Do you ship chargers to California?",
  },
  {
    id: "4",
    role: "bot",
    text: "Yes, Corn ships all chargers to CA with tracked delivery.",
  },
];

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSendMessage = (event?: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    // Placeholder handler to demonstrate UI flow; replace with real send logic when ready.
    // eslint-disable-next-line no-console
    console.log("Send message:", trimmed);

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: trimmed },
    ]);
    setInput("");
  };

  if (pathname?.startsWith("/cart")) return null;

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+170px)] z-[80] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-auto">
      {isOpen ? (
        <div className="pointer-events-auto mb-3 w-full rounded-2xl border border-neutral-200 bg-white shadow-[0_16px_50px_-24px_rgba(0,0,0,0.45)] sm:w-[380px]">
          <header className="flex items-center justify-between gap-3 rounded-t-2xl border-b border-neutral-100 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-neutral-200 bg-white">
                <Image
                  src="/logo.png"
                  alt="Corn Electronics logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                  priority={false}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  Corn Support
                </p>
                <p className="text-[11px] text-neutral-500">
                  Typically replies in under 2 min
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-900"
              aria-label="Close support chat"
            >
              <XIcon />
            </button>
          </header>

          <div className="flex max-h-96 flex-col gap-3 overflow-y-auto bg-[#F7F7F7] px-4 py-4 sm:max-h-[420px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition ${
                    message.role === "user"
                      ? "bg-[#ED1C24] text-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)]"
                      : "bg-white text-[#111827] shadow-sm border border-neutral-100"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 rounded-b-2xl border-t border-neutral-100 bg-white px-4 py-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about orders, shipping..."
              className="h-11 flex-1 rounded-xl border border-neutral-200 bg-[#F7F7F7] px-3 text-sm text-neutral-900 outline-none transition focus:border-[#ED1C24] focus:bg-white focus:ring-2 focus:ring-[#ED1C24]/15"
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#ED1C24] px-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:shadow-xl active:translate-y-0 disabled:opacity-75"
              disabled={!input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      ) : null}

      <div className="pointer-events-auto flex justify-end">
        <button
          type="button"
          aria-label={isOpen ? "Close support chat" : "Open support chat"}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ED1C24] text-white shadow-[0_18px_40px_-20px_rgba(237,28,36,0.75)] transition hover:scale-105 hover:shadow-[0_18px_40px_-18px_rgba(237,28,36,0.9)] active:scale-100"
        >
          {isOpen ? <XIcon /> : <ChatIcon />}
        </button>
      </div>
    </div>
  );
}

const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="h-6 w-6"
    aria-hidden
  >
    <path d="M7 10h6" />
    <path d="M7 14h4" />
    <path d="M5 18.5V7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H8.5Z" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="h-5 w-5"
    aria-hidden
  >
    <path d="m7 7 10 10M17 7 7 17" />
  </svg>
);
