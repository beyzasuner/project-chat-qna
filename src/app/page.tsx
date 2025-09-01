"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ChatWindow } from "@/components/ChatWindow";
import { Composer } from "@/components/Composer";
import { MessageBubble } from "@/components/MessageBubble";
import { SettingsDialog } from "@/components/SettingsDialog";
import { TypingDots } from "@/components/TypingDots";

import type { Conversation, Message } from "@/types/chat";
import { uid } from "@/lib/uid";
import {
  loadConversations,
  saveConversations,
  loadActiveId,
  saveActiveId,
} from "@/lib/storage";
import { loadSettings, type Settings } from "@/lib/settings";

/* ----------------------------- küçük yardımcılar ----------------------------- */

// İlk kullanıcı mesajından başlık üret
const titleFrom = (messages: Message[]) => {
  const first = messages.find((m) => m.role === "user");
  return first?.content.trim().slice(0, 30).replace(/\s+/g, " ") || "Yeni sohbet";
};

// OpenAI proxy çağrısı (server-side /api/chat)
async function callOpenAI(prompt: string, history: Message[], settings: Settings) {
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: prompt },
  ];

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, model: settings.model }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `OpenAI request failed (${res.status})`);
  }

  const data = await res.json();
  return String(data?.content ?? "");
}

// Loading için güvenlik zamanlayıcısı (örn. bekleyen istek kilitlenirse)
const startLoadingGuard = (
  setLoading: (v: boolean) => void,
  ref: MutableRefObject<number | null>,   // ← React.MutableRefObject yerine
  ms = 20000
) => {
  if (ref.current) window.clearTimeout(ref.current);
  ref.current = window.setTimeout(() => {
    setLoading(false);
    ref.current = null;
  }, ms);
};

const clearLoadingGuard = (ref: MutableRefObject<number | null>) => { // ← burada da
  if (ref.current) {
    window.clearTimeout(ref.current);
    ref.current = null;
  }
};

/* ---------------------------------- sayfa ---------------------------------- */

export default function Page() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sadece model ayarı kullanılıyor
  const [settings, setSettings] = useState<Settings>({ model: "gpt-4o-mini" });
  const [openSettings, setOpenSettings] = useState(false);

  const loadingTimeoutRef = useRef<number | null>(null);

  // Mevcut aktif konuşma (derived state)
  const active = useMemo(
    () => convs.find((c) => c.id === activeId) ?? null,
    [convs, activeId]
  );

  /* ------------------------------ ilk yükleme ------------------------------ */
  useEffect(() => {
    const saved = loadConversations();
    const aid = loadActiveId();
    const s = loadSettings();
    setSettings({ model: s.model || "gpt-4o-mini" });

    if (saved.length) {
      setConvs(saved);
      setActiveId(aid ?? saved[0].id);
    } else {
      const id = uid();
      const now = Date.now();
      setConvs([{ id, title: "Yeni sohbet", messages: [], createdAt: now, updatedAt: now }]);
      setActiveId(id);
    }
  }, []);

  /* ------------------------------- kalıcılık ------------------------------- */
  useEffect(() => {
    saveConversations(convs);
  }, [convs]);

  useEffect(() => {
    if (activeId) saveActiveId(activeId);
  }, [activeId]);

  /* ------------------------------ sohbet işlemleri ------------------------------ */

  const newConversation = () => {
    const id = uid();
    const now = Date.now();
    setConvs((prev) => [
      { id, title: "Yeni sohbet", messages: [], createdAt: now, updatedAt: now },
      ...prev,
    ]);
    setActiveId(id);
  };

  const selectConversation = (id: string) => setActiveId(id);

  const renameConversation = (id: string) => {
    const t = prompt("Yeni başlık?");
    if (!t) return;
    setConvs((prev) => prev.map((c) => (c.id === id ? { ...c, title: t } : c)));
  };

  const deleteConversation = (id: string) => {
    if (!confirm("Sohbet silinsin mi?")) return;

    setConvs((prev) => {
      const filtered = prev.filter((c) => c.id !== id);

      // Aktif sohbet silinirse mantıklı bir komşuyu aktif yap
      setActiveId((curr) => {
        if (curr !== id) return curr;
        // Önce listede silinenin önceki komşusunu, yoksa ilk öğeyi seç
        const idx = prev.findIndex((c) => c.id === id);
        const neighbor = prev[idx - 1] ?? filtered[0] ?? null;
        return neighbor ? neighbor.id : null;
      });

      return filtered;
    });
  };

  // Mesaj ekleme (tek sorumluluk: state güncelleme)
  const addMessage = (role: "user" | "assistant", content: string) => {
    setConvs((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        const msg: Message = { id: uid(), role, content, createdAt: Date.now() };
        const nextMessages = [...c.messages, msg];
        return {
          ...c,
          messages: nextMessages,
          updatedAt: Date.now(),
          title: c.messages.length ? c.title : titleFrom(nextMessages),
        };
      })
    );
  };

  /* ------------------------------- gönderme akışı ------------------------------- */

  const handleSend = async (text: string) => {
    if (loading || !text.trim()) return;

    addMessage("user", text);
    setLoading(true);
    startLoadingGuard(setLoading, loadingTimeoutRef, 20000);

    try {
      const history = active?.messages ?? [];
      const answer = await callOpenAI(text, history, settings);
      addMessage("assistant", answer);
    } catch (err: unknown) {
      const { getErrorMessage } = await import("@/lib/errors");
      addMessage("assistant", `Üzgünüm, bir hata oluştu:\n\n${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
      clearLoadingGuard(loadingTimeoutRef);
    }
  };

  /* --------------------------------- render --------------------------------- */

  return (
    <div className="h-full w-screen flex flex-col bg-muted/30">
      {/* Mobil üst bar + sheet */}
      <Header
        conversations={convs.map((c) => ({ id: c.id, title: c.title }))}
        activeId={activeId}
        onNew={newConversation}
        onSelect={selectConversation}
        onRename={renameConversation}
        onDelete={deleteConversation}
        onOpenSettings={() => setOpenSettings(true)}
      />

      <div className="flex-1 min-h-0 flex">
        {/* Masaüstü sol panel */}
        <div className="hidden md:block h-full">
          <Sidebar
            conversations={convs.map((c) => ({ id: c.id, title: c.title }))}
            activeId={activeId}
            onNew={newConversation}
            onSelect={selectConversation}
            onRename={renameConversation}
            onDelete={deleteConversation}
            onOpenSettings={() => setOpenSettings(true)}
          />
        </div>

        <main className="flex-1 min-h-0 flex flex-col">
          <ChatWindow>
            {(active?.messages ?? []).map((m) => (
              <MessageBubble key={m.id} role={m.role} content={m.content} />
            ))}

            {loading && (
              <div className="w-full flex justify-start my-2">
                <div className="bg-white text-foreground border rounded-2xl px-3 py-2 flex items-center gap-2">
                  <span className="text-muted-foreground">Yazıyor</span>
                  <TypingDots />
                </div>
              </div>
            )}
          </ChatWindow>

          <Composer onSend={handleSend} disabled={loading} />
        </main>
      </div>

      <SettingsDialog
        open={openSettings}
        onOpenChange={(v) => {
          setOpenSettings(v);
          if (!v) {
            const s = loadSettings();
            setSettings({ model: s.model || "gpt-4o-mini" });
          }
        }}
      />
    </div>
  );
}
