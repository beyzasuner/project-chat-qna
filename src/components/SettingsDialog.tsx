"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { loadSettings, saveSettings, type Settings } from "@/lib/settings";

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [s, setS] = useState<Settings>({ model: "gpt-4o-mini" });

  useEffect(() => {
    if (open) setS(loadSettings());
  }, [open]);

  const onSave = () => {
    saveSettings(s);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ayarlar</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-4 py-2"
        >
          <div className="space-y-1">
            <label htmlFor="model" className="text-sm font-medium">
              Model
            </label>

            {/* select yerine input kullanmak istersen kolayca değiştirebilirsin */}
            <select
              id="model"
              value={s.model}
              onChange={(e) =>
                setS((p) => ({ ...p, model: e.target.value }))
              }
              className="w-full border rounded-md px-2 py-2 bg-background"
            >
              <option value="gpt-4o-mini">gpt-4o-mini</option>
              <option value="gpt-4o">gpt-4o</option>
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            </select>

            <p
              id="model-help"
              className="text-xs text-muted-foreground"
            >
              Yanıtlar OpenAI üzerinden alınır. Sunucuda{" "}
              <code>OPENAI_API_KEY</code> tanımlı olmalı.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit">Kaydet</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
