import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Trash2,
  Heart,
  Globe,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { useAICompanion } from "@/hooks/useAICompanion";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "I need help finding clean water",
  "My family is hungry, what can I do?",
  "I'm feeling scared and alone",
  "How do I get medical help?",
  "Where can I find shelter?",
];

const Companion = () => {
  const { messages, isLoading, error, sendMessage, clearChat } = useAICompanion();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Page header */}
      <div className="sticky top-16 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-amber" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-semibold">AI Companion</h1>
            <p className="text-xs text-muted-foreground">Here to help, 24/7</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-forest/10 border border-forest/30 rounded-full">
            <Globe className="w-3 h-3 text-forest" />
            <span className="text-xs text-forest font-medium">47 Languages</span>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChat} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber/10 flex items-center justify-center">
                <Heart className="w-10 h-10 text-amber" />
              </div>
              <h2 className="font-serif text-2xl font-semibold mb-2">
                Welcome to the AI Companion
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                I'm here to listen, help, and connect you with resources. 
                You can talk to me in your own language.
              </p>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Try asking:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="px-4 py-2 text-sm bg-card border border-border rounded-full hover:border-primary/50 hover:bg-card/80 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-amber/15 flex-shrink-0 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-amber" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] p-4 rounded-2xl",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border rounded-bl-md"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex-shrink-0 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">You</span>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber/15 flex-shrink-0 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-amber" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 border-t border-border bg-card/80 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... I'm here to help."
              className="min-h-[60px] max-h-[200px] resize-none pr-14 bg-background"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 bottom-2"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Your conversations are private. We're here to help, not to judge.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Companion;
