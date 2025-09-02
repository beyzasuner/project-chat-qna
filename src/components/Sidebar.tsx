"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/ModeToggle"; // ← eklendi

type ConversationLite = { id: string; title: string };

export function Sidebar({
  conversations,
  activeId,
  onNew,
  onSelect,
  onRename,
  onDelete,
  onOpenSettings,
}: {
  conversations: ConversationLite[];
  activeId: string | null;
  onNew: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenSettings: () => void;
}) {
  return (
    <aside className="h-full w-[18rem] border-r bg-background flex flex-col">
      {/* Üst başlık */}
      <div className="p-3 flex items-center justify-between border-b">
        <h1 className="text-lg font-semibold">Q&A Chat</h1>
        <p className="text-xs text-muted-foreground">ChatGPT benzeri</p>
      </div>

      {/* Yeni sohbet butonu */}
      <div className="px-3 pb-3">
        <Button className="w-full" onClick={onNew}>
          Yeni sohbet
        </Button>
      </div>

      <Separator />

      {/* Konuşmalar listesi */}
      <ScrollArea className="h-full">
        <nav aria-label="Konuşmalar" className="py-2">
          {conversations.length === 0 && (
            <div className="text-sm text-muted-foreground px-3">
              Henüz konuşma yok.
            </div>
          )}

          <ul className="space-y-1 px-2">
            {conversations.map((c) => {
              const isActive = activeId === c.id;
              return (
                <li key={c.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    title={c.title}
                    onClick={() => onSelect(c.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(c.id);
                      }
                    }}
                    className={[
                      "w-full rounded-lg px-3 py-2 transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                      isActive ? "bg-muted" : "hover:bg-muted",
                    ].join(" ")}
                  >
                    {/* Grid: başlık 1fr, aksiyonlar auto → metinler her zaman görünür */}
                    <div className="grid grid-cols-[1fr_auto] items-center gap-2 min-w-0 pr-1">
                      <span className="min-w-0 truncate text-left">{c.title}</span>

                      <div className="shrink-0 whitespace-nowrap flex items-center gap-3">
                        <button
                          type="button"
                          className="text-xs text-muted-foreground hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRename(c.id);
                          }}
                          aria-label="Konuşmayı yeniden adlandır"
                        >
                          Yeniden adlandır
                        </button>
                        <button
                          type="button"
                          className="text-xs text-destructive hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(c.id);
                          }}
                          aria-label="Konuşmayı sil"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </ScrollArea>

      <Separator />

      {/* Alt bar: Ayarlar + Tema (masaüstünde tema düğmesi burada) */}
      <div className="p-3 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onOpenSettings}
          type="button"
        >
          Ayarlar
        </Button>

        {/* Tema butonu: masaüstünde her zaman görünür */}
        <ModeToggle />
      </div>
    </aside>
  );
}
