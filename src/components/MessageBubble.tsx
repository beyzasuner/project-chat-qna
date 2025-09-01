"use client";

import { MarkdownText } from "@/components/MarkdownText";

export function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div className={`w-full flex my-2 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] rounded-2xl px-4 py-2 shadow-sm",
          "whitespace-pre-wrap break-words",          // uzun kelimeleri kır
          "overflow-x-auto",                           // kod blokları için yatay kaydırma
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground border border-border rounded-bl-sm",
        ].join(" ")}
      >
        {isUser ? content : <MarkdownText>{content}</MarkdownText>}
      </div>
    </div>
  );
}
