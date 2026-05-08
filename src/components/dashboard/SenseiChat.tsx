import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";
import { chatWithSensei } from "../../services/geminiService";

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function SenseiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const responseText = await chatWithSensei(input, messages);
      const modelMessage: Message = { role: 'model', parts: [{ text: responseText }] };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = { role: 'model', parts: [{ text: "Desculpe, Sensei teve um problema de conexão. Tente novamente." }] };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[400px] h-[600px] flex flex-col cartoon-card bg-white border-brand-primary overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-brand-primary p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-black uppercase italic tracking-tighter">Falar com Sensei</h3>
                  <div className="text-[10px] uppercase font-bold opacity-70">Coach Tático de Elite</div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:rotate-90 transition-transform p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 bg-brand-secondary/5"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                  <Bot size={48} className="mb-4 text-brand-primary" />
                  <p className="font-black uppercase italic text-sm tracking-tighter">
                    Sensei pronto para análise. <br/>Envie suas dúvidas táticas.
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-brand-accent text-brand-secondary' : 'bg-brand-primary text-white'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl font-medium text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-brand-accent text-brand-secondary rounded-tr-none' 
                        : 'bg-white text-brand-secondary border-2 border-brand-primary/10 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.parts[0].text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border-2 border-brand-primary/10 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-brand-primary" />
                    <span className="text-xs font-black uppercase italic opacity-40">Refletindo...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t-2 border-black/5 bg-white">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ex: Como melhorar meu spray de Vandal?"
                  className="w-full pl-6 pr-14 py-4 bg-brand-secondary/5 rounded-xl outline-none focus:ring-2 ring-brand-primary border-4 border-black/5 font-medium transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-brand-primary text-white rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all border-4 border-black/20 ${
          isOpen ? 'bg-white text-brand-primary' : 'bg-brand-primary text-white'
        }`}
      >
        {isOpen ? <X size={40} /> : <MessageSquare size={40} />}
      </motion.button>
    </div>
  );
}
