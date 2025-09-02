"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function Composer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const composingRef = useRef(false); // IME (örn. Türkçe öneri çubuğu) aktif mi?

  // Yazdıkça otomatik boyutlandır (max 200px)
  const autoResize = (el: HTMLTextAreaElement) => {
    const max = 200; // px
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, max) + "px";
  };

  // Mesaj gönder
  const sendMessage = () => {
    if (disabled) return;
    const text = (inputRef.current?.value ?? "").trim();
    if (!text) return;

    onSend(text);

    if (inputRef.current) {
      inputRef.current.value = "";
      autoResize(inputRef.current);
      inputRef.current.focus();
    }
  };

  // Enter → gönder, Shift+Enter → satır, Ctrl/Cmd+Enter → gönder
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (composingRef.current) return; // IME açıkken Enter'ı engelleme
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;

    if ((e.key === "Enter" && !e.shiftKey) || (e.key === "Enter" && isCmdOrCtrl)) {
      e.preventDefault();
      sendMessage();
    }
  };

  // IME event'leri (kullandığımız için uyarı yok)
  const onCompositionStart = () => {
    composingRef.current = true;
  };
  const onCompositionEnd = () => {
    composingRef.current = false;
  };

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
      autoResize(inputRef.current);
    }
  }, [disabled]);

  return (
    <div className="border-t p-3 flex gap-2 items-end">
      <Textarea
        ref={inputRef}
        placeholder="Mesajınızı yazın…"
        aria-label="Mesaj alanı"
        rows={1}
        onKeyDown={onKeyDown}
        onInput={(e) => autoResize(e.currentTarget)}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        autoFocus
        className="resize-none min-h-[40px] max-h-40 overflow-y-auto"
      />
      <Button onClick={sendMessage} disabled={!!disabled}>
        Gönder
      </Button>
    </div>
  );
}
