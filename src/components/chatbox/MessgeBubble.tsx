import { memo } from "react";
import { Message } from "./Chatbox";
import { cn } from "@/lib/utils";
import { DisplayMarkDown } from "./DisplayMarkDown";

export const MessageBubble = memo(function MessageBubble({
  message,
}: {
  message: Message;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm relative",
          isUser
            ? "bg-indigo-500 text-white rounded-br-sm"
            : "bg-white text-slate-800 rounded-bl-sm"
        )}
      >
        {!isUser && (
          <p className="mb-1 text-[11px] font-semibold text-slate-500">
            TalkPDF
          </p>
        )}

        {/* USER -> plain text | ASSISTANT -> Markdown */}
        {isUser ? (
          <p className="whitespace-pre-line leading-relaxed">
            {message.text}
          </p>
        ) : (
          <div className="prose prose-sm max-w-none leading-relaxed">
            <DisplayMarkDown text={message.text} />
          </div>
        )}

        {message.time && (
          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span>{message.time}</span>

            {!isUser && (
              <div
                className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {/* Action buttons (like copy or retry) would go here */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});