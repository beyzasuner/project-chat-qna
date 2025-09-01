import type { Conversation } from "@/types/chat";

const KEY = "qna-conversations";
const ACTIVE = "qna-active-id";

export const loadConversations = (): Conversation[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
};


export const saveConversations = (list: Conversation[]) => {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export const loadActiveId = (): string | null => localStorage.getItem(ACTIVE);
export const saveActiveId = (id: string) => localStorage.setItem(ACTIVE, id);
