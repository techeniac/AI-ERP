"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { Bot, X, Send, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/ui.store";
import { useAuth } from "@/lib/hooks/use-auth";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isTextUIPart } from "ai";
import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";

const CONTEXT_SUGGESTIONS: Record<string, string[]> = {
  "/dashboard": [
    "Give me a company health summary",
    "What needs my attention today?",
    "Which customers are at risk?",
    "Summarise this week's activity",
    "Show me revenue vs last month",
  ],
  "/crm": [
    "Show my open leads",
    "Which leads need follow-up?",
    "Score the leads in Proposal stage",
    "Create a new lead",
    "What is our pipeline value?",
  ],
  "/finance": [
    "Show overdue invoices",
    "Summarise AR aging",
    "Draft invoice for a customer",
    "What is our cash position?",
    "Revenue vs last month",
  ],
  "/finance/invoices": [
    "Show overdue invoices",
    "Which invoices are unpaid past 30 days?",
    "Draft a new invoice",
    "Summarise revenue this month",
    "What is total outstanding AR?",
  ],
  "/support": [
    "Show tickets breaching SLA",
    "Summarise high priority tickets",
    "Which tickets need escalation?",
    "What is our average resolution time?",
    "Assign ticket to an agent",
  ],
  "/operations": [
    "Show overdue tasks",
    "What tasks are blocked?",
    "Summarise project progress",
    "Create a new task",
    "Show tasks due this week",
  ],
  "/customers": [
    "Which customers are at risk?",
    "Show customers with outstanding balance",
    "Summarise top 5 customers by revenue",
    "Find customers with no activity in 30 days",
    "Show customer health scores",
  ],
  "/approvals": [
    "Show pending approvals",
    "What approvals need my action today?",
    "Summarise approval backlog",
    "Which approvals are expiring soon?",
    "Show rejected approvals this month",
  ],
};

const SLASH_COMMANDS = [
  { command: "/invoice", label: "New Invoice", href: "/finance/invoices/new" },
  { command: "/lead", label: "New Lead", href: "/crm/new" },
  { command: "/ticket", label: "New Ticket", href: "/support" },
  { command: "/approve", label: "Approval Queue", href: "/approvals" },
];

function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "justify-end")}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-teal)] text-white mt-0.5">
          <Bot className="h-3.5 w-3.5" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-[var(--brand-navy)] text-white rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        )}
      >
        {isUser ? (
          <p>{content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export function AICommandBar() {
  const { aiPanelOpen, setAIPanelOpen } = useUIStore();
  const { user } = useAuth();
  const pathname = usePathname();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState("");
  const contextKey = Object.keys(CONTEXT_SUGGESTIONS).find((k) => pathname.startsWith(k)) ?? "/dashboard";
  const suggestions = CONTEXT_SUGGESTIONS[contextKey] ?? CONTEXT_SUGGESTIONS["/dashboard"] ?? [];

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: {
        userRole: user?.role ?? "employee",
        currentModule: pathname,
      },
    }),
  });

  const isLoading = chat.status === "streaming" || chat.status === "submitted";

  function handleSend() {
    if (!inputValue.trim() || isLoading) return;
    const slashCmd = SLASH_COMMANDS.find((c) => inputValue.trim() === c.command);
    if (slashCmd) {
      window.location.href = slashCmd.href;
      return;
    }
    void chat.sendMessage({ parts: [{ type: "text" as const, text: inputValue.trim() }] });
    setInputValue("");
  }

  useEffect(() => {
    if (aiPanelOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [aiPanelOpen]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages, isLoading]);

  // Cmd+K / Ctrl+K shortcut
  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setAIPanelOpen(!aiPanelOpen);
      }
      if (e.key === "Escape" && aiPanelOpen) {
        setAIPanelOpen(false);
      }
    },
    [aiPanelOpen, setAIPanelOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!aiPanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={() => setAIPanelOpen(false)}
      />

      {/* Panel */}
      <div className="fixed right-4 top-4 z-50 flex h-[calc(100vh-2rem)] w-[420px] flex-col rounded-2xl border bg-background shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-teal)] px-4 py-3 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">AI Assistant</p>
            <p className="text-xs text-white/70">Ask anything about your business</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/20"
            onClick={() => setAIPanelOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef as React.RefObject<HTMLDivElement>}>
          {chat.messages.length === 0 ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center pt-4 pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-teal)]/10 mb-3">
                  <Sparkles className="h-6 w-6 text-[var(--brand-teal)]" />
                </div>
                <p className="text-sm font-medium">How can I help you today?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ask questions, get insights, or take actions.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Zap className="h-3 w-3" />
                  Suggested for this page
                </p>
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="w-full text-left rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-border transition-colors"
                    onClick={() => {
                      setInputValue(suggestion);
                      inputRef.current?.focus();
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Quick shortcuts</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {SLASH_COMMANDS.map((cmd) => (
                    <a
                      key={cmd.command}
                      href={cmd.href}
                      className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs hover:bg-muted/50 transition-colors"
                    >
                      <code className="text-[var(--brand-teal)] font-mono">{cmd.command}</code>
                      <span className="text-muted-foreground">{cmd.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chat.messages.map((m: UIMessage) => {
                const textContent = m.parts
                  .filter(isTextUIPart)
                  .map((p) => p.text)
                  .join("") || "";
                return (
                  <MessageBubble key={m.id} role={m.role as "user" | "assistant"} content={textContent} />
                );
              })}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-teal)] text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="border-t bg-muted/30 p-3">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Ask anything... (↵ to send, Shift+↵ for new line)"
              rows={1}
              className="flex-1 resize-none rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] min-h-[40px] max-h-[120px]"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <Button
              type="button"
              size="icon"
              disabled={!inputValue.trim() || isLoading}
              onClick={handleSend}
              className="h-10 w-10 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal)]/90 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
            Press <kbd className="rounded border px-1 py-0.5 text-[9px] font-mono">⌘K</kbd> to toggle
          </p>
        </div>
      </div>
    </>
  );
}
