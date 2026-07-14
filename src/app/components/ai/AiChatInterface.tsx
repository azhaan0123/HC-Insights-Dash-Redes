/**
 * AiChatInterface — Context-aware chat with natural language reporting,
 * inline action buttons, and simulated AI responses that reference page data.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  User,
  ArrowUpRight,
  Loader2,
  Bot,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { useAiContext } from "../../contexts/AiContext";
import { getChatResponseForRoute, type ChatResponse } from "./aiData";
import { AiPresetQuestions } from "./AiPresetQuestions";
import { AGENT_META } from "./aiTypes";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: { label: string; actionType: string }[];
  timestamp: Date;
}

interface AiChatInterfaceProps {
  className?: string;
}

export function AiChatInterface({ className }: AiChatInterfaceProps) {
  const { pageContext } = useAiContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const agentMeta = AGENT_META[pageContext.agentType];

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getChatResponseForRoute(pageContext.route);
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: response.content,
        actions: response.actions,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-4 min-h-0"
      >
        {messages.length === 0 ? (
          /* Empty State with Presets */
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
              <div
                className="grid size-14 place-items-center rounded-2xl mb-4 shadow-sm"
                style={{ backgroundColor: `${agentMeta.color}15` }}
              >
                <Sparkles
                  className="size-6"
                  style={{ color: agentMeta.color }}
                />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">
                {agentMeta.label} Agent
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                {pageContext.contextDescription}. Ask questions or pick a
                suggestion below.
              </p>
            </div>
            <AiPresetQuestions
              onSelectQuestion={sendMessage}
              className="mt-auto"
            />
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} agentColor={agentMeta.color} />
            ))}
            {isTyping && <TypingIndicator agentLabel={agentMeta.label} />}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-3 shrink-0">
        {messages.length > 0 && (
          <AiPresetQuestions
            onSelectQuestion={sendMessage}
            className="mb-3"
          />
        )}
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${agentMeta.label} Agent...`}
              className="w-full resize-none rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#e32168]/30 focus:border-[#e32168]/40 transition-all min-h-[40px] max-h-[120px]"
              rows={1}
            />
          </div>
          <Button
            size="sm"
            disabled={!input.trim() || isTyping}
            onClick={() => sendMessage(input)}
            className="shrink-0 size-9 p-0 rounded-xl bg-[#e32168] hover:bg-[#ca0055] text-white shadow-sm disabled:opacity-40"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Message Bubble ─────────────────────────────────────────────────────────

function MessageBubble({
  message,
  agentColor,
}: {
  message: Message;
  agentColor: string;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "")}>
      {/* Avatar */}
      <div
        className={cn(
          "grid size-7 place-items-center rounded-lg shrink-0 shadow-sm",
          isUser ? "bg-muted" : ""
        )}
        style={!isUser ? { backgroundColor: `${agentColor}20` } : undefined}
      >
        {isUser ? (
          <User className="size-3.5 text-muted-foreground" />
        ) : (
          <Sparkles className="size-3.5" style={{ color: agentColor }} />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex-1 min-w-0 rounded-xl px-4 py-3",
          isUser
            ? "bg-[#e32168] text-white"
            : "bg-muted/50 border border-border"
        )}
      >
        <div
          className={cn(
            "text-xs leading-relaxed whitespace-pre-wrap",
            isUser ? "text-white/90" : "text-foreground/80"
          )}
        >
          {/* Render markdown-like content */}
          {message.content.split("\n").map((line, i) => {
            // Bold text
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
              <p key={i} className={line === "" ? "h-2" : ""}>
                {parts.map((part, j) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                      <strong
                        key={j}
                        className={cn(
                          "font-bold",
                          isUser ? "text-white" : "text-foreground"
                        )}
                      >
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return <span key={j}>{part}</span>;
                })}
              </p>
            );
          })}
        </div>

        {/* Inline Action Buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-border/30">
            {message.actions.map((action, i) => (
              <button
                key={action.label}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors cursor-pointer",
                  i === 0
                    ? "bg-white/20 hover:bg-white/30 text-white border border-white/20"
                    : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/10",
                  !isUser && i === 0
                    ? "bg-[#e32168]/10 hover:bg-[#e32168]/20 text-[#e32168] border-[#e32168]/20"
                    : "",
                  !isUser && i !== 0
                    ? "bg-muted hover:bg-muted/80 text-foreground/70 border-border"
                    : ""
                )}
              >
                {action.label}
                <ArrowUpRight className="size-3 opacity-60" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Typing Indicator ───────────────────────────────────────────────────────

function TypingIndicator({ agentLabel }: { agentLabel: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-7 place-items-center rounded-lg bg-muted/50 shrink-0">
        <Bot className="size-3.5 text-muted-foreground animate-pulse" />
      </div>
      <div className="rounded-xl bg-muted/50 border border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[10px] text-muted-foreground/60">
            Analyzing {agentLabel.toLowerCase()} patterns…
          </span>
        </div>
      </div>
    </div>
  );
}
