import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Send, History, Sparkles, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import logo from "@/assets/aniverse-logo.png";

export const Route = createFileRoute("/_app/assistant")({ component: Assistant });

type Thread = { id: string; title: string; updated_at: string };

function Assistant() {
  const { user, session } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [showThreads, setShowThreads] = useState(false);
  const [ready, setReady] = useState(false);

  const loadThreads = async () => {
    if (!user) return;
    const { data } = await supabase.from("chat_threads").select("id,title,updated_at")
      .eq("user_id", user.id).order("updated_at", { ascending: false });
    setThreads((data as Thread[]) ?? []);
    return data as Thread[] | null;
  };

  // bootstrap
  useEffect(() => {
    if (!user) return;
    (async () => {
      const list = await loadThreads();
      if (list && list.length > 0) {
        await openThread(list[0].id);
      } else {
        await newThread();
      }
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const newThread = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("chat_threads")
      .insert({ user_id: user.id, title: "New chat" }).select("id,title,updated_at").single();
    if (error || !data) { toast.error(error?.message ?? "Failed"); return; }
    setThreads((t) => [data as Thread, ...t]);
    setActiveId(data.id);
    setInitialMessages([]);
    setShowThreads(false);
  };

  const openThread = async (id: string) => {
    setActiveId(id);
    const { data } = await supabase.from("chat_messages").select("id,role,content,created_at")
      .eq("thread_id", id).order("created_at", { ascending: true });
    const msgs: UIMessage[] = (data ?? []).map((m) => ({
      id: m.id, role: m.role as "user" | "assistant",
      parts: [{ type: "text", text: m.content }],
    }));
    setInitialMessages(msgs);
    setShowThreads(false);
  };

  const deleteThread = async (id: string) => {
    await supabase.from("chat_threads").delete().eq("id", id);
    const list = await loadThreads();
    if (id === activeId) {
      if (list && list[0]) openThread(list[0].id);
      else newThread();
    }
  };

  if (!ready || !activeId) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Initializing Ani...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header
        onNew={newThread}
        onToggle={() => setShowThreads((s) => !s)}
        threadCount={threads.length}
      />
      {showThreads && (
        <ThreadList threads={threads} activeId={activeId} onOpen={openThread} onDelete={deleteThread} />
      )}
      <ChatWindow
        key={activeId}
        threadId={activeId}
        token={session?.access_token ?? ""}
        initial={initialMessages}
        onFirstMessage={loadThreads}
      />
    </main>
  );
}

function Header({ onNew, onToggle, threadCount }: { onNew: () => void; onToggle: () => void; threadCount: number }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between glass px-4 py-3">
      <div className="flex items-center gap-3">
        <img src={logo} alt="" className="h-9 w-9" />
        <div>
          <p className="font-bold text-foreground">Ani</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">AniVerse AI Engine</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onToggle} className="relative flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <History className="h-4 w-4 text-foreground" />
          {threadCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-neon-pink px-1 text-[9px] font-bold text-background">{threadCount}</span>}
        </button>
        <button onClick={onNew} className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-neon shadow-neon">
          <Plus className="h-4 w-4 text-primary-foreground" />
        </button>
      </div>
    </header>
  );
}

function ThreadList({ threads, activeId, onOpen, onDelete }: { threads: Thread[]; activeId: string; onOpen: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className="border-b border-border bg-card/60 px-3 py-2">
      <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent threads</p>
      <div className="max-h-64 space-y-1 overflow-y-auto">
        {threads.map((t) => (
          <div key={t.id} className={`flex items-center gap-2 rounded-xl px-2 py-2 ${t.id === activeId ? "bg-primary/15" : ""}`}>
            <button onClick={() => onOpen(t.id)} className="flex-1 truncate text-left text-sm text-foreground">
              {t.title || "New chat"}
            </button>
            <button onClick={() => onDelete(t.id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatWindow({ threadId, token, initial, onFirstMessage }: { threadId: string; token: string; initial: UIMessage[]; onFirstMessage: () => void }) {
  const transport = useMemo(() => new DefaultChatTransport({
    api: "/api/chat",
    headers: { Authorization: `Bearer ${token}` },
    body: { threadId },
  }), [threadId, token]);

  const { messages, sendMessage, status } = useChat({
    id: threadId, messages: initial, transport,
    onError: (e) => toast.error(e.message),
  });

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(initial.length);

  useEffect(() => { inputRef.current?.focus(); }, [threadId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, status]);
  useEffect(() => {
    if (messages.length === 1 && prevCount.current === 0) onFirstMessage();
    prevCount.current = messages.length;
  }, [messages.length, onFirstMessage]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const t = input.trim();
    if (!t || status === "streaming" || status === "submitted") return;
    setInput("");
    await sendMessage({ text: t });
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const suggestions = [
    "Recommend something emotional",
    "Best new mecha this season",
    "Anime like Cyberpunk Edgerunners",
  ];

  return (
    <>
      <div className="flex-1 px-4 py-5">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center pt-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-hero shadow-neon">
              <Sparkles className="h-9 w-9 text-primary-foreground" />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold text-foreground">Welcome back, Pilot.</h2>
            <p className="mt-1 text-sm text-muted-foreground">I've analyzed 4,200 timelines to find your next favorite anime.</p>
            <div className="mt-8 flex w-full flex-col gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => sendMessage({ text: s })}
                  className="rounded-2xl glass px-4 py-3 text-left text-sm text-foreground hover:bg-muted/50">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              if (m.role === "user") {
                return (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-secondary px-4 py-2.5 text-sm text-secondary-foreground">{text}</div>
                  </div>
                );
              }
              return (
                <div key={m.id} className="flex gap-2">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-neon">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed text-foreground">{text || "..."}</div>
                </div>
              );
            })}
            {(status === "submitted" || status === "streaming") && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-neon animate-pulse">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="text-sm text-muted-foreground">Thinking...</div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <form onSubmit={submit} className="sticky bottom-24 z-10 mx-3 mb-2 flex items-end gap-2 rounded-3xl glass p-2 shadow-card">
        <textarea
          ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submit(e); }}
          placeholder="Type a message..." rows={1}
          className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
        />
        <button type="submit" disabled={!input.trim() || status === "streaming" || status === "submitted"}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-neon shadow-neon disabled:opacity-40">
          <Send className="h-4 w-4 text-primary-foreground" />
        </button>
      </form>
    </>
  );
}
