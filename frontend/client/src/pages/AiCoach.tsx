import { useState, useRef, useEffect } from "react";
import { useAiChatHistory, useSendAiMessage } from "@/hooks/use-ai-coach";
import { Brain, Send, Bot, User as UserIcon } from "lucide-react";
import { GamifiedButton } from "@/components/ui/gamified-button";
import { format } from "date-fns";

export default function AiCoach() {
  const { data: history, isLoading } = useAiChatHistory();
  const { mutate: sendMessage, isPending } = useSendAiMessage();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;
    
    sendMessage(input, {
      onSuccess: () => setInput("")
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-5rem)]">
      <header className="mb-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center border-2 border-purple-200">
          <Brain className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-800">AI Coach</h1>
          <p className="text-slate-500 font-medium text-sm">Your personal habit strategist.</p>
        </div>
      </header>

      <div className="flex-1 card-gamified bg-white flex flex-col overflow-hidden border-2 mb-2">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {isLoading ? (
            <div className="flex justify-center p-10">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !history?.length ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Bot className="w-16 h-16 text-purple-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2 font-display">Hi, I'm your AI Coach!</h3>
              <p className="text-slate-500 font-medium max-w-sm">
                Ask me for advice on how to build habits, break bad ones, or get motivated when you're feeling lazy.
              </p>
            </div>
          ) : (
            history.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div key={idx} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border-2 ${isUser ? 'bg-primary/10 text-primary border-primary/20' : 'bg-purple-100 text-purple-600 border-purple-200'}`}>
                    {isUser ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 border-2 ${isUser ? 'bg-primary text-white border-primary shadow-[0_2px_0_0_hsl(142,71%,35%)] rounded-tr-none' : 'bg-slate-50 text-slate-700 border-slate-200 shadow-[0_2px_0_0_hsl(var(--border))] rounded-tl-none'}`}>
                    <p className="font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <span className={`text-[10px] font-bold mt-2 block opacity-70 ${isUser ? 'text-right' : 'text-left'}`}>
                      {format(new Date(msg.createdAt), 'h:mm a')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          {isPending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 border-2 border-purple-200 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 bg-slate-50 border-t-2 border-slate-200">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-3 rounded-2xl bg-white border-2 border-slate-200 font-medium text-slate-800 focus:outline-none focus:border-purple-400 transition-colors"
              placeholder="Ask for habit advice..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPending}
            />
            <GamifiedButton 
              type="submit" 
              disabled={!input.trim() || isPending}
              size="icon"
              className="w-14 h-14 bg-purple-500 hover:bg-purple-600 border-purple-700 text-white"
            >
              <Send className="w-6 h-6" />
            </GamifiedButton>
          </form>
        </div>
      </div>
    </div>
  );
}
