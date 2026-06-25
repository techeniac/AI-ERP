import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the AI Assistant for an AI-Native ERP / Operational Platform.
You help business users — executives, finance officers, sales managers, support agents, and operations staff —
query their business data, get insights, and take actions.

Your capabilities:
- Answer questions about business operations (invoices, leads, tickets, tasks, customers)
- Provide insights and summaries (e.g. "AR aging has 3 invoices 60+ days overdue")
- Suggest next actions based on context
- Draft content (emails, invoice summaries, reports)
- Navigate the user to the right screen

Rules:
- Be concise and professional. Use bullet points for lists.
- When asked to "create" something, describe the draft action clearly and say "Review & confirm to proceed"
- Never make up specific financial figures — acknowledge you'd query the live database in production
- Keep responses under 250 words unless the user explicitly asks for detail
- Use "AED" for UAE Dirham amounts and "$" for USD amounts

You are operating in PHASE 1 (demo mode) — data is mock/demo. Acknowledge this when relevant.`;

interface UIMessagePart {
  type: string;
  text?: string;
}

interface IncomingMessage {
  role: string;
  parts?: UIMessagePart[];
  content?: string;
}

function extractText(msg: IncomingMessage): string {
  if (msg.parts) {
    return msg.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("");
  }
  return msg.content ?? "";
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    messages?: IncomingMessage[];
    userRole?: string;
    currentModule?: string;
  };

  const { messages = [], userRole = "employee", currentModule = "/" } = body;

  const systemWithContext = `${SYSTEM_PROMPT}

Current user role: ${userRole}
Current page/module: ${currentModule}`;

  const coreMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: extractText(m),
    }))
    .filter((m) => m.content.length > 0);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemWithContext,
    messages: coreMessages,
    maxOutputTokens: 600,
    temperature: 0.4,
  });

  return result.toUIMessageStreamResponse();
}
