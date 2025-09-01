"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"   // varsayılan karanlık
      enableSystem={false}  // sistem temasını dikkate alma → hep bizimki
      storageKey="qna-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
