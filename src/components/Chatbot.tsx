import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Trash2 } from 'lucide-react';
import { botReply, type BotReply } from '@/data/chatbot';
import { products, formatPrice } from '@/data/products';
import { getChatHistory, saveChatHistory, clearChatHistory, type ChatMessage } from '@/lib/storage';
import type { Product } from '@/data/products';
import type { TranslationDict } from '@/data/i18n';

type ChatbotProps = {
  t: TranslationDict;
  onProductClick: (product: Product) => void;
};

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function Chatbot({ t, onProductClick }: ChatbotProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getChatHistory();
    if (stored.length) {
      setMessages(stored);
    } else {
      const intro: ChatMessage = { role: 'bot', text: t.chat.welcome, time: now() };
      setMessages([intro]);
      saveChatHistory([intro]);
    }
  }, [t.chat.welcome]);

  useEffect(() => {
    if (open) setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
  }, [open, messages, typing]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const userMsg: ChatMessage = { role: 'user', text, time: now() };
    const next = [...messages, userMsg];
    setMessages(next);
    saveChatHistory(next);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply: BotReply = botReply(text);
      const botMsg: ChatMessage = { role: 'bot', text: reply.text, time: now(), productIds: reply.productIds };
      const updated = [...next, botMsg];
      setMessages(updated);
      saveChatHistory(updated);
      setTyping(false);
    }, 550);
  };

  const clearChat = () => {
    clearChatHistory();
    const intro: ChatMessage = { role: 'bot', text: t.chat.welcome, time: now() };
    setMessages([intro]);
    saveChatHistory([intro]);
  };

  return (
    <>
      {!open && (
        <button className="chat-fab" onClick={() => setOpen(true)} aria-label="Open Ayurique chat support">
          <MessageCircle size={22} strokeWidth={1.5} />
          <span className="chat-fab-pulse" />
        </button>
      )}

      {open && (
        <div className="chat-panel" role="dialog" aria-label="Ayurique customer care chat">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-brand">AYURIQUE</span>
              <span className="chat-sub">
                <span className="chat-online-dot" /> {t.chat.customerCare}
              </span>
            </div>
            <div className="chat-header-actions">
              <button onClick={clearChat} aria-label={t.chat.clearConversation} className="chat-clear-btn">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setOpen(false)} aria-label={t.chat.closeChat} className="chat-close-btn">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="chat-messages" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <div className="chat-msg-bubble">
                  {msg.text.split('\n').map((line, j) => (
                    <p key={j} className={line.startsWith('•') ? 'chat-product-line' : ''}>{line}</p>
                  ))}
                  {msg.productIds && msg.productIds.length > 0 && (
                    <div className="chat-products">
                      {msg.productIds.map((id) => {
                        const p = products.find((pr) => pr.id === id);
                        if (!p) return null;
                        return (
                          <button key={id} className="chat-product-card" onClick={() => { onProductClick(p); setOpen(false); }}>
                            <img src={p.images[0]} alt={p.name} loading="lazy" />
                            <span className="chat-product-name">{p.name}</span>
                            <span className="chat-product-price">{formatPrice(p.price)}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <span className="chat-time">{msg.time}</span>
              </div>
            ))}
            {typing && (
              <div className="chat-msg bot">
                <div className="chat-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          {messages.length <= 2 && (
            <div className="chat-suggestions">
              {t.chat.suggestions.map((q) => (
                <button key={q} className="chat-suggestion-chip" onClick={() => send(q)}>
                  <Sparkles size={13} /> {q}
                </button>
              ))}
            </div>
          )}

          <form className="chat-input-row" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chat.askPlaceholder}
              aria-label="Type your message"
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn" aria-label="Send message">
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
