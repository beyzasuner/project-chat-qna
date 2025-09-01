"use client";
import { useEffect, useRef } from "react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export function ChatWindow({ children }: { children: React.ReactNode }) {
  const endRef = useRef<HTMLDivElement | null>(null);

  // kaç child var
  const count = React.Children.count(children);

  // sadece yeni mesaj geldiğinde scroll
  useEffect(() => {
    if (count > 0) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [count]);

  const hasChildren = count > 0;

  return (
    <div className="flex-1 min-h-0">
      <ScrollArea className="h-full">
        <div className="p-4 max-w-3xl mx-auto">
          {hasChildren ? (
            <>
              {children}
              <div className="h-2" />
              <div ref={endRef} />
            </>
          ) : (
            <Card
              className="p-6 text-center text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <h2 className="text-xl font-semibold mb-2">Merhaba! 👋</h2>
              <p>Bir soru yazın ve Enter’a basın. Yanıtlar burada görünecek.</p>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
