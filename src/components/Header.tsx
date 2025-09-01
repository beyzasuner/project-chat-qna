"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

type ConversationLite = { id: string; title: string };

export function Header({
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
  const [open, setOpen] = useState(false);

  // Mobil sheet içinde seçim/oluşturma sonrası sheet kapat
  const handleSelect = (id: string) => {
    onSelect(id);
    setOpen(false);
  };
  const handleNew = () => {
    onNew();
    setOpen(false);
  };
  const handleOpenSettings = () => {
    onOpenSettings();
    setOpen(false);
  };

  return (
    <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-3 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Sohbet listesini aç">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[18rem] sm:w-[22rem]">
          <SheetHeader className="px-4 py-3">
            <SheetTitle>Sohbetler</SheetTitle>
          </SheetHeader>

          <Sidebar
            conversations={conversations}
            activeId={activeId}
            onNew={handleNew}
            onSelect={handleSelect}
            onRename={onRename}   // yeniden adlandır/sil işlemlerinde sheet açık kalması genelde daha iyi
            onDelete={onDelete}
            onOpenSettings={handleOpenSettings}
          />
        </SheetContent>
      </Sheet>

      <div className="text-sm font-semibold">Q&amp;A Chat</div>

      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button variant="outline" onClick={handleOpenSettings}>Ayarlar</Button>
      </div>
    </header>
  );
}
