"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessgeBubble";
import ChatInput from "./ChatInput";
import AIThinking from "./AIThinking";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  addUserAndAiPlaceholder,
  appendToLastAiMessage,
  getChatHistory,
} from "@/store/chatSlice";

export type Message = {
  role: "user" | "ai";
  text: string;
  time?: string;
};

export default function Chatbox({ userId }: { userId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, error } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (userId) {
      dispatch(getChatHistory(userId));
    }
  }, [userId, dispatch]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const queueRef = useRef<string[]>([]);
  const typingRef = useRef(false);

  const typeNext = () => {
    if (queueRef.current.length === 0) {
      typingRef.current = false;
      return;
    }

    typingRef.current = true;
    const nextChar = queueRef.current.shift()!;

    dispatch(appendToLastAiMessage(nextChar));

    setTimeout(typeNext, 50);
  };

  //send Message
  const sendMessage = async () => {
    const userMessage = input.trim();

    queueRef.current = [];
    setInput("");

    dispatch(
      addUserAndAiPlaceholder({
        userId,
        content: userMessage,
      }),
    );

    try {
      setLoading(true);
      const res = await fetch("/api/agent/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage, userId: userId }),
      });

      if (!res.body) return;
      setLoading(false);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            continue;
          }

          //Handles data events
          if (trimmed.startsWith("data:")) {
            const payload = trimmed.replace("data:", "").trim();
            if (!payload) continue;

            const data = JSON.parse(payload);

            //queue valid messages
            if (data.message !== undefined && data.message !== null) {
              queueRef.current.push(data.message);

              if (!typingRef.current) {
                typeNext();
              }
            }
          }

          //Handle event types: end/error
          else if (trimmed.startsWith("event:")) {
            const eventType = trimmed.replace("event:", "").trim();

            if (eventType === "end") {
              console.log("Stream Ended!");
              reader.cancel(); //stop reading
            }

            if (eventType === "error") {
              console.log("Stream error received");
              reader.cancel();
            }
          }
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Fetch streaming Error: ", (error as Error).message);
    }
  };

  //auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs"></div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-900">
              TalkPDF Assistant
            </span>
            <span className="text-[11px] text-slate-500">
              Product Requirements Doc.pdf
            </span>
          </div>
        </div>

        <button className="flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] text-slate-500">
          Devon Lane <ChevronDown className="h-3 w-3" />
        </button>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {(messages || []).map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {loading && <AIThinking />}

        <div ref={bottomRef} className="mb-10" />
      </div>

      {/* INPUT */}
      <ChatInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        loading={loading}
        userId="123"
      />
    </div>
  );
}
