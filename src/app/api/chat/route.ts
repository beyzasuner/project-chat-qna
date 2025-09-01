import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

/* ---------------------------- input doğrulama ---------------------------- */
const ChatSchema = z.object({
  model: z.string().default("gpt-4o-mini"),
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        // boş/whitespace mesajı reddet
        content: z.string().transform((s) => s.trim()).refine((s) => s.length > 0, {
          message: "content cannot be empty",
        }),
      })
    )
    .min(1, "messages must contain at least one item"),
});

/* ------------------------------ yardımcılar ------------------------------ */
function json(status: number, data: unknown) {
  return NextResponse.json(data, { status });
}

/* --------------------------------- POST --------------------------------- */
export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return json(500, { error: "Server is not configured (OPENAI_API_KEY missing)." });

  // Gövdeyi oku ve doğrula
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  const parsed = ChatSchema.safeParse(payload);
  if (!parsed.success) {
    return json(400, { error: "Validation failed.", details: parsed.error.flatten() });
  }
  const body = parsed.data;

  // Upstream isteği için timeout guard (25s)
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 25_000);

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: body.model,
        messages: body.messages,
        temperature: 0.3,
      }),
    });

    clearTimeout(t);

    if (!resp.ok) {
      // OpenAI hata kodlarını anlamlı yerel kodlara eşle
      const status = resp.status;
      let error = "Upstream error.";
      try {
        const j = await resp.json();
        error = j?.error?.message || error;
      } catch {
        // text() veya hiçbir şey okumadan kısa bırak
      }

      if (status === 401) return json(401, { error: "Unauthorized: invalid or missing API key." });
      if (status === 429) return json(429, { error: "Rate limited: please try again shortly." });
      if (status >= 400 && status < 500) return json(400, { error }); // kötü istek
      return json(502, { error: "Upstream service failed." }); // sunucu/bağlantı hatası
    }

    const data = await resp.json();
    const content: string =
      data?.choices?.[0]?.message?.content ?? "";

    return json(200, { content });
  } catch (err: unknown) {
    clearTimeout(t);
    const message =
      err instanceof DOMException && err.name === "AbortError"
        ? "Upstream timeout."
        : err instanceof Error
        ? err.message
        : "Unknown error.";
    return json(504, { error: message });
  }
}
