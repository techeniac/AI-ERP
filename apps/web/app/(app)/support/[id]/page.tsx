"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Lock, AlertTriangle, CheckCircle2, ArrowUp, Sparkles, ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockTickets } from "@/lib/mock/tickets";
import { formatDate, formatRelative } from "@/lib/utils/format";
import { toast } from "sonner";
import { TOKEN } from "@/lib/tokens";

function getAiSuggestions(subject: string, customerName: string): string[] {
  const lowerSubject = subject.toLowerCase();
  if (lowerSubject.includes("login") || lowerSubject.includes("access") || lowerSubject.includes("dashboard")) {
    return [
      `Hi, thank you for reaching out to our support team. I understand you're unable to access the ERP dashboard after the recent update. This is a known issue affecting a small number of users and our engineering team is actively working on a fix. In the meantime, could you please try clearing your browser cache and cookies, then attempt to log in using an incognito/private window? If the issue persists, please share your browser version and operating system so we can assist further.`,
      `Hello, I apologise for the inconvenience caused by this access issue. Our team has identified that the recent update may have caused a session token conflict for some accounts. Could you please try logging out completely, clearing your browser cookies, and logging back in? If you continue to face issues, we can reset your session from our end — please confirm and I'll do that immediately.`,
      `Hi there, thank you for your patience. We've received a few reports of dashboard access issues post-update and our team has already deployed a patch. Could you please refresh the page or try accessing it from a different browser? If the issue persists after 15 minutes, please reply here and I'll escalate this to our technical team with high priority.`,
    ];
  }
  if (lowerSubject.includes("invoice") || lowerSubject.includes("tax") || lowerSubject.includes("billing")) {
    return [
      `Hi, thank you for flagging this billing discrepancy. I've pulled up the invoice in question and I can see the concern. Our finance team is reviewing the tax calculation — it appears the GST rate may have been applied incorrectly due to a product classification issue. I'll have a corrected invoice sent to you within 24 hours. Apologies for the inconvenience.`,
      `Hello, I understand there's a discrepancy in the tax amount shown on your invoice. Could you please confirm the invoice number and the specific line item you believe is incorrect? Once I have those details, I'll escalate this to our finance team immediately and ensure a revised invoice is issued before the due date.`,
      `Hi, thank you for bringing this to our attention. Invoice tax discrepancies can sometimes occur when multiple GST slabs apply to a single order. I'm looping in our finance team to review and correct this. In the meantime, please do not make payment against the current invoice — we'll issue a corrected version shortly.`,
    ];
  }
  if (lowerSubject.includes("export") || lowerSubject.includes("download") || lowerSubject.includes("csv")) {
    return [
      `Hi, I understand the CSV export is not working for you. This is typically caused by a browser security restriction or a temporary server-side issue. Could you please try the following: (1) Use Google Chrome or Firefox, (2) Disable any browser extensions that block downloads, (3) Try the export from the Reports module instead of the module-level export. Please let me know if any of these steps help.`,
      `Hello, thank you for reporting the export issue. Our team has identified a bug in the data export function that affects certain account configurations. A fix has been deployed — could you please refresh the application and attempt the export again? If it still fails, please share the exact error message or a screenshot so we can investigate further.`,
      `Hi there, I'm sorry you're experiencing trouble with the CSV download. This can sometimes happen when the dataset is too large for a direct browser download. Could you try filtering the date range to a smaller window (e.g., 30 days) and export again? If you need the full dataset, I can arrange a scheduled export to be emailed to you directly.`,
    ];
  }
  return [
    `Hi ${customerName}, thank you for contacting our support team. I've reviewed your ticket and I'm looking into this right now. Could you please provide any additional details or steps to reproduce the issue? I'll update you within the hour with a resolution or next steps.`,
    `Hello, thank you for reaching out. I understand this issue is impacting your work and I want to help resolve it as quickly as possible. I'm escalating this to our specialist team who will be in touch within 2 hours. In the meantime, please feel free to share any screenshots or error messages that might help us diagnose the issue faster.`,
    `Hi, I've taken note of your concern and have reviewed the details. Our team is investigating this issue and we expect to have an update for you within 4 hours. We apologise for the inconvenience and thank you for your patience. I'll send you a follow-up once we have a resolution.`,
  ];
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const ticket = mockTickets.find((t) => t.id === id);

  const [replyText, setReplyText] = useState("");
  const [messages, setMessages] = useState(ticket?.messages ?? []);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  function handleSend(internal: boolean) {
    if (!replyText.trim()) return;
    const newMsg = {
      id: `msg-new-${Date.now()}`,
      ticketId: id,
      authorId: "current-user",
      authorName: "You",
      authorType: "agent" as const,
      body: replyText.trim(),
      isInternal: internal,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setReplyText("");
    toast.success(internal ? "Internal note added" : "Reply sent");
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <Link href="/support" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Tickets
        </Link>
        <EmptyState title="Ticket not found" description="This ticket may have been deleted or the ID is incorrect." />
      </div>
    );
  }

  const slaColor = ticket.slaBreached ? TOKEN.critical : ticket.slaPercentUsed >= 80 ? TOKEN.warning : TOKEN.success;
  const SlaIcon = ticket.slaBreached ? XCircle : ticket.slaPercentUsed >= 80 ? AlertTriangle : CheckCircle2;

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/support" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-4 w-4" /> Support Tickets
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-mono text-muted-foreground">{ticket.ticketNumber}</span>
              <StatusBadge status={ticket.status} />
              <StatusBadge status={ticket.priority} />
              {ticket.slaBreached && (
                <Badge className="bg-red-100 text-red-700 border-0 text-xs gap-1">
                  <AlertTriangle className="h-3 w-3" /> SLA Breached
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-bold">{ticket.subject}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {ticket.customerName} · Opened {formatRelative(ticket.createdAt)}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5 h-8">
              <ArrowUp className="h-3.5 w-3.5" />
              Escalate
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 h-8"
              onClick={() => toast.success("Ticket marked resolved")}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Resolve
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main: message thread */}
        <div className="space-y-4">
          <div className="space-y-3">
            {messages.map((msg) => {
              const isAgent = msg.authorType === "agent";
              const isInternal = msg.isInternal;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAgent ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={`text-xs font-bold ${isAgent ? "bg-[var(--brand-navy)] text-white" : "bg-muted text-foreground"}`}>
                      {msg.authorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[80%] space-y-1 ${isAgent ? "items-end" : "items-start"} flex flex-col`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{msg.authorName}</span>
                      {isInternal && (
                        <Badge className="bg-amber-100 text-amber-700 border-0 text-xs gap-1 py-0">
                          <Lock className="h-2.5 w-2.5" /> Internal
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{formatRelative(msg.createdAt)}</span>
                    </div>
                    <div
                      className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                        isInternal
                          ? "border border-dashed border-amber-300 bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-200"
                          : isAgent
                          ? "bg-[var(--brand-navy)] text-white rounded-tr-sm"
                          : "bg-muted rounded-tl-sm"
                      }`}
                    >
                      {msg.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="space-y-3">
            {/* AI Suggested Replies */}
            <div className="rounded-lg border border-violet-200 bg-violet-50/50 dark:border-violet-800/50 dark:bg-violet-900/10 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-violet-700 dark:text-violet-400 hover:bg-violet-100/50 dark:hover:bg-violet-900/20 transition-colors"
                onClick={() => setAiPanelOpen((v) => !v)}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Suggested Replies
                </span>
                {aiPanelOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {aiPanelOpen && (
                <div className="px-4 pb-4 space-y-2 border-t border-violet-200 dark:border-violet-800/50 pt-3">
                  <p className="text-xs text-violet-600 dark:text-violet-400 mb-3">
                    Based on the ticket subject and customer history. Click a suggestion to use it.
                  </p>
                  {getAiSuggestions(ticket.subject, ticket.customerName).map((suggestion, i) => (
                    <div
                      key={i}
                      tabIndex={0}
                      className="rounded-md border border-violet-200 dark:border-violet-800/50 bg-white dark:bg-violet-950/30 p-3 cursor-pointer hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors group focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1"
                      onClick={() => {
                        setReplyText(suggestion);
                        setAiPanelOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setReplyText(suggestion);
                          setAiPanelOpen(false);
                        }
                      }}
                    >
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 group-hover:line-clamp-none group-focus-within:line-clamp-none transition-all">
                        {suggestion}
                      </p>
                      <p className="text-xs text-violet-600 font-medium mt-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                        Click or press Enter to use →
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Textarea
              placeholder="Type your reply…"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <div className="flex gap-2">
              <Button
                className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white gap-2"
                onClick={() => handleSend(false)}
              >
                <Send className="h-4 w-4" />
                Send Reply
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => handleSend(true)}
              >
                <Lock className="h-4 w-4" />
                Internal Note
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">SLA Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="flex items-center gap-1 font-semibold" style={{ color: slaColor }}>
                  <SlaIcon className="h-3.5 w-3.5" />
                  {ticket.slaPercentUsed}%
                </span>
              </div>
              <Progress value={ticket.slaPercentUsed} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Deadline: {formatDate(ticket.slaDeadline)}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <p className="text-muted-foreground">First Response</p>
                  <p className="font-medium">{ticket.slaConfig.firstResponseHours}h SLA</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Resolution</p>
                  <p className="font-medium">{ticket.slaConfig.resolutionHours}h SLA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { label: "Customer", value: ticket.customerName },
                { label: "Status", value: <StatusBadge status={ticket.status} /> },
                { label: "Priority", value: <StatusBadge status={ticket.priority} /> },
                { label: "Assigned To", value: ticket.assigneeName ?? "Unassigned" },
                { label: "Opened", value: formatDate(ticket.createdAt) },
                { label: "Updated", value: formatRelative(ticket.updatedAt) },
              ].map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground text-xs">{row.label}</span>
                  <span className="text-xs font-medium text-right">{row.value}</span>
                </div>
              ))}
              {ticket.tags && ticket.tags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={() => toast.success("Ticket closed")}
          >
            Close Ticket
          </Button>
        </div>
      </div>
    </div>
  );
}
