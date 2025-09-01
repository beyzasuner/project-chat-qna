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
    if (composingRef.current) return; // IME açıkken engelleme
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;

    if ((e.key === "Enter" && !e.shiftKey) || (e.key === "Enter" && isCmdOrCtrl)) {
      e.preventDefault();
      sendMessage();
    }
  };

  // IME başlangıç/bitiş
  const onCompositionStart = () => (composingRef.current = true);
  const onCompositionEnd = () => (composingRef.current = false);

  // Yazdıkça otomatik boyutlandır
  const autoResize = (el: HTMLTextAreaElement) => {
    const max = 200; // px cinsinden maksimum yükseklik
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, max) + "px";
  };

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    autoResize(e.currentTarget);
  };

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
      autoResize(inputRef.current);
    }
  }, [disabled]);

  return (
    <div className="border-t p-4 flex gap-2">
      <Textarea
        ref={inputRef}
        placeholder="Mesajınızı yazın…"
        className="resize-none"
        onKeyDown={onKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onInput={onInput}
        spellCheck
        autoFocus
        aria-label="Sohbet mesajı"
        disabled={!!disabled}
        rows={1}
      />
      <Button type="button" onClick={sendMessage} disabled={!!disabled} aria-label="Mesajı gönder">
        Gönder
      </Button>
    </div>
  );
}
