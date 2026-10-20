import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, X, Send, Compass } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';

interface ChatMessage {
  id: number;
  sender: 'user' | 'admin';
  message: string;
  created_at: string;
}

const POLL_INTERVAL = 3000; // 3 seconds

export const ChatWidget: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const lastIdRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'X-User-Id': String(user?.id ?? ''),
    'X-User-Email': user?.email ?? '',
  }), [user]);

  const fetchMessages = useCallback(async (silent = false) => {
    if (!user) return;
    try {
      const res = await fetch(
        `${API_BASE}/chat.php?after=${lastIdRef.current}`,
        { headers: chatHeaders() }
      );
      const data = await res.json();
      if (data.ok && data.messages.length > 0) {
        setMessages((prev) => {
          // Deduplicate — exclude IDs already in state (handles optimistic overlap)
          const existingIds = new Set(prev.map((m) => m.id));
          const fresh = data.messages.filter((m: ChatMessage) => !existingIds.has(m.id));
          if (fresh.length === 0) return prev;
          lastIdRef.current = data.messages[data.messages.length - 1].id;
          // Count unread admin messages when chat is closed
          if (!open || silent) {
            const adminNew = fresh.filter((m: ChatMessage) => m.sender === 'admin').length;
            if (adminNew > 0) setUnread((u) => u + adminNew);
          }
          return [...prev, ...fresh];
        });
      }
    } catch {}
  }, [user, chatHeaders, open]);

  // Initial load when widget opens
  useEffect(() => {
    if (!open || !user) return;
    // Reset and load all messages
    setMessages([]);
    lastIdRef.current = 0;
    setUnread(0);
    fetch(`${API_BASE}/chat.php?after=0`, { headers: chatHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setMessages(data.messages);
          if (data.messages.length > 0) {
            lastIdRef.current = data.messages[data.messages.length - 1].id;
          }
        }
      })
      .catch(() => {});
  }, [open, user]);

  // Polling
  useEffect(() => {
    if (!user) return;
    pollRef.current = setInterval(() => fetchMessages(true), POLL_INTERVAL);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [user, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setUnread(0);
    }
  }, [open]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending || !user) return;
    const text = input.trim();
    setInput('');
    setSending(true);

    // Optimistic update
    const optimistic: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch(`${API_BASE}/chat.php`, {
        method: 'POST',
        headers: chatHeaders(),
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data.ok && data.message) {
        // Replace optimistic with real
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? data.message : m))
        );
        lastIdRef.current = data.message.id;
      }
    } catch {}
    setSending(false);
  };

  // Don't render if not logged in
  if (!user) return null;

  const formatTime = (dt: string) => {
    const d = new Date(dt);
    return d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full bg-[#89CFF0] hover:bg-[#70c4e8] shadow-lg shadow-[#89CFF0]/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Deschide chat"
        >
          <MessageSquare className="w-5 h-5 text-[#07080c]" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl bg-[#0d0f14] border border-white/[0.09] shadow-2xl shadow-black/60 overflow-hidden"
          style={{ maxHeight: 'calc(100vh - 6rem)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-[#89CFF0]/10 border-b border-white/[0.07] shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#89CFF0]/20 border border-[#89CFF0]/40 flex items-center justify-center text-[#89CFF0]">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white">aventure. suport</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-neutral-400">online</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full text-neutral-500 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#89CFF0]/10 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-5 h-5 text-[#89CFF0]" />
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Bună, {user.name.split(' ')[0]}! Cu ce te putem ajuta?
                </p>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#89CFF0] text-[#07080c] rounded-br-sm'
                        : 'bg-white/[0.07] text-white rounded-bl-sm'
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-neutral-600 px-1">
                    {!isUser && <span className="text-[#89CFF0] mr-1">aventure.</span>}
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 px-3 py-3 border-t border-white/[0.07] shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Scrie un mesaj..."
              className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="w-9 h-9 rounded-full bg-[#89CFF0] hover:bg-[#70c4e8] flex items-center justify-center text-[#07080c] disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
