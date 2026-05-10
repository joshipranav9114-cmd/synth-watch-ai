import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const auth = request.headers.get("authorization");
        if (!auth?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
        const token = auth.slice(7);

        const url = process.env.SUPABASE_URL!;
        const anon = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const sb = createClient(url, anon, { auth: { persistSession: false } });
        const { data: u, error: uerr } = await sb.auth.getUser(token);
        if (uerr || !u.user) return new Response("Unauthorized", { status: 401 });
        const userId = u.user.id;

        const body = (await request.json()) as { messages: UIMessage[]; threadId: string };
        if (!body.threadId) return new Response("threadId required", { status: 400 });

        const sbAuthed = createClient(url, anon, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false },
        });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const last = body.messages[body.messages.length - 1];
        const lastText = last?.parts?.map((p) => (p.type === "text" ? p.text : "")).join("") ?? "";
        if (last?.role === "user" && lastText.trim()) {
          await sbAuthed.from("chat_messages").insert({
            thread_id: body.threadId, user_id: userId, role: "user", content: lastText,
          });
          await sbAuthed.from("chat_threads")
            .update({ updated_at: new Date().toISOString(), title: lastText.slice(0, 60) })
            .eq("id", body.threadId);
        }

        const result = streamText({
          model,
          system: "You are Ani, a warm, witty AI anime concierge inside the AniVerse app. Recommend anime with vivid, cinematic flair. Keep replies tight (3-6 sentences) unless asked for depth. When recommending, list 1-3 picks with a one-line vibe each. Use markdown sparingly.",
          messages: await convertToModelMessages(body.messages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: body.messages,
          onFinish: async ({ responseMessage }) => {
            const text = responseMessage.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            if (text.trim()) {
              await sbAuthed.from("chat_messages").insert({
                thread_id: body.threadId, user_id: userId, role: "assistant", content: text,
              });
            }
          },
        });
      },
    },
  },
});
