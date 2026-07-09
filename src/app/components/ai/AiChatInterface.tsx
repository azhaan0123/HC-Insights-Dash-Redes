import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { User, Loader2, Sparkles, CornerDownLeft } from "lucide-react";
import { AiPresetQuestions } from "./AiPresetQuestions";
import { cn } from "../ui/utils";

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp?: string;
};

export function AiChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Hello! I am Helix, your assistant. I have connected to your active workspace data across Dashboards, Encounters, and HCC Coding. How can I help you today?',
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input,
      timestamp: 'Just now'
    };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          content: 'I have analyzed the current filter criteria. We are observing a 15% increase in HCC risk score drop-offs this quarter compared to the benchmark. Would you like me to draft an intervention list for the clinical team?',
          timestamp: 'Just now'
        }
      ]);
      setIsTyping(false);
    }, 1400);
  };

  const handlePresetClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-muted/50 dark:bg-muted/10 flex-1 relative">
      <ScrollArea className="flex-1 min-h-0 px-4 py-4">
        <div className="flex flex-col gap-4 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex gap-3 text-sm animate-fade-in-up", msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
            >
              <div className={cn(
                "flex size-7 shrink-0 select-none items-center justify-center rounded-lg shadow-2xs text-xs font-semibold mt-0.5",
                msg.role === 'user' 
                  ? 'bg-card text-white dark:bg-secondary dark:text-foreground' 
                  : 'bg-gradient-to-br from-[#e32168] to-[#fb5b87] text-white shadow-[#e32168]/20'
              )}>
                {msg.role === 'user' ? <User className="size-3.5" /> : <Sparkles className="size-3.5" />}
              </div>
              
              <div className="flex flex-col gap-1 max-w-[82%]">
                <div
                  className={cn(
                    "px-3.5 py-2.5 text-xs md:text-sm leading-relaxed shadow-2xs transition-all",
                    msg.role === 'user'
                      ? 'bg-[#e32168] text-white rounded-2xl rounded-tr-xs font-normal'
                      : 'bg-card border border-border/80 dark:border-border rounded-2xl rounded-tl-xs text-foreground font-normal'
                  )}
                >
                  {msg.content}
                </div>
                {msg.timestamp && (
                  <span className={cn("text-[10px] text-muted-foreground/70 px-1", msg.role === 'user' ? 'text-right' : 'text-left')}>
                    {msg.timestamp}
                  </span>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
             <div className="flex gap-3 text-sm flex-row animate-fade-in-up">
               <div className="flex size-7 shrink-0 select-none items-center justify-center rounded-lg bg-gradient-to-br from-[#e32168] to-[#fb5b87] text-white shadow-2xs shadow-[#e32168]/20 mt-0.5">
                 <Sparkles className="size-3.5" />
               </div>
               <div className="flex items-center gap-2 px-4 py-3 bg-card border border-border/80 dark:border-border rounded-2xl rounded-tl-xs shadow-2xs">
                 <Loader2 className="size-3.5 animate-spin text-[#e32168]" />
                 <span className="text-xs text-muted-foreground font-medium">Analyzing workspace data...</span>
               </div>
             </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Footer Controls & Prompt Box */}
      <div className="p-4 border-t border-border/80 dark:border-border bg-card shrink-0 shadow-lg shadow-black/5">
        <AiPresetQuestions onSelect={handlePresetClick} />
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center w-full"
        >
          <Input
            type="text"
            placeholder="Ask Helix..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-10 w-full pl-3.5 pr-11 text-xs md:text-sm rounded-xl border-border dark:border-border bg-muted/40 dark:bg-muted/20 focus-visible:ring-1 focus-visible:ring-[#e32168] focus-visible:border-[#e32168] focus-visible:bg-background transition-all shadow-inner"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isTyping || !input.trim()}
            className={cn(
              "absolute right-1 size-8 rounded-lg transition-all cursor-pointer",
              input.trim() 
                ? "bg-[#e32168] hover:bg-[#ca0055] text-white shadow-sm shadow-[#e32168]/25 scale-100" 
                : "bg-secondary dark:bg-card text-muted-foreground/70 dark:text-muted-foreground scale-95"
            )}
            title="Submit prompt"
          >
            <CornerDownLeft className="size-3.5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-muted-foreground/70">
          <span>Press Enter to send</span>
          <span className="flex items-center gap-1">
            <span className="size-1 rounded-full bg-emerald-500" />
            <span>Active workspace context</span>
          </span>
        </div>
      </div>
    </div>
  );
}
