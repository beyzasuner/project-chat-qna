"use client";
export function TypingDots() {
  return (
    <div className="inline-flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:-0.2s]" />
      <span className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:-0.1s]" />
      <span className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-bounce" />
    </div>
  );
}
