export type Settings = { model: string };

const KEY = "qna-settings";
const DEFAULTS: Settings = { model: "gpt-4o-mini" };

export const loadSettings = (): Settings => {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Settings) : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};


export const saveSettings = (s: Settings) => {
  localStorage.setItem(KEY, JSON.stringify(s));
};
