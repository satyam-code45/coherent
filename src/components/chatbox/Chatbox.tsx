"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

export default function Chatbox({ userId }: { userId: string }) {
  const [message, setMessage] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  //send Message
  const sendMessage = () => {
    console.log("");
  };
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
      {/* <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {message.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {true && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div> */}

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* messages */}

        {true && (
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </div>

            {/* AI Thoughts */}
            <div className="bg-slate-100 rounded p-2">
              <strong>AI Thoughts:</strong>
              <ul className="list-disc list-inside">
                <li>Analyze the last user input</li>
                <li>Consider context from the previous messages</li>
              </ul>
            </div>

            {/*AI Todo/Plans */}
            <div className="bg-slate-50 rounded p-2">
                <strong>AI Plans:</strong>
                <ul className="list-decimal list-inside">
                    <li>Draft Response structure</li>
                    <li>Suggest relevant examples</li>
                    <li>Check for clarity and brevity</li>
                </ul>
                </div>
          </div>
        )}
      </div>
    </div>
  );
}
