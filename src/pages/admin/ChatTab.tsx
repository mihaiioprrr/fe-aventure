import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Send, ArrowLeft, User, Compass } from 'lucide-react';
import { API_BASE } from '../../context/AuthContext';

interface ChatMessage {
  id: number;
  sender: 'user' | 'admin';
  message: string;
  created_at: string;
}

interface Conversation {
  user_id: number;
  user_name: string;
  user_email: string;
  last_message: string;
  last_sender: 'user' | 'admin';
  last_at: string;
  unread_count: number;
}

interface Props {
  headers: Record<string, string>;
}

const POLL_INTERVAL = 3000;

export const ChatTab: React.FC<Props> = ({ headers }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [activeUser, setActiveUser] = useState<{ name: string; email: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const lastIdRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversations list
  const loadConversations = useCallback(() => {
    fetch(`${API_BASE}/admin/chat.php`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setConversations(data.conversations);
      })
      .finally(() => setLoadingConvs(false));
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // Poll conversations list when no thread open
  useEffect(() => {
    if (activeUserId) return;
    const id = setInterval(loadConversations, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [activeUserId, loadConversations]);

  // Load thread for active user — only NEW messages (after lastIdRef)
  const loadThread = useCallback(() => {
    if (!activeUserId) return;
    fetch(`${API_BASE}/admin/chat.php?user_id=${activeUserId}&after=${lastIdRef.current}`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) return;
        if (data.messages?.length > 0) {
          setMessages((prev) => {
            // Collect all real IDs already in state (exclude optimistic temps with Date.now() IDs)
            const existingIds = new Set(prev.map((m) => m.id));
            const fresh = data.messages.filter((m: ChatMessage) => !existingIds.has(m.id));
            if (fresh.length === 0) return prev;
            lastIdRef.current = data.messages[data.messages.length - 1].id;
            return [...prev, ...fresh];
          });
        }
        if (data.user) setActiveUser(data.user);
      });
  }, [activeUserId, headers]);

  // Open thread
  const openThread = (conv: Conversation) => {
    setActiveUserId(conv.user_id);
    setMessages([]);
    lastIdRef.current = 0;

    // Load full thread
    fetch(`${API_BASE}/admin/chat.php?user_id=${conv.user_id}`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setMessages(data.messages);
          if (data.messages.length > 0) {
            lastIdRef.current = data.messages[data.messages.length - 1].id;
          }
          if (data.user) setActiveUser(data.user);
        }
      });
  };

  // Poll thread
  useEffect(() => {
    if (!activeUserId) return;
    pollRef.current = setInterval(loadThread, POLL_INTERVAL);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeUserId, loadThread]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on thread open
  useEffect(() => {
    if (activeUserId) setTimeout(() => inputRef.current?.focus(), 100);
  }, [activeUserId]);

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending || !activeUserId) return;
    const text = input.trim();
    setInput('');
    setSending(true);

    const optimistic: ChatMessage = {
      id: Date.now(),
      sender: 'admin',
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch(`${API_BASE}/admin/chat.php`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ user_id: activeUserId, message: text }),
      });
      const data = await res.json();
      if (data.ok && data.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? data.message : m))
        );
        lastIdRef.current = data.message.id;
        loadConversations();
      }
    } catch {}
    setSending(false);
  };

  const formatTime = (dt: string) =>
    new Date(dt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });

  const formatDate = (dt: string) =>
    new Date(dt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  // ── Thread view ──────────────────────────────────────────────────
  if (activeUserId) {
    return (
      <div className="flex flex-col rounded-2xl border border-white/[0.07] overflow-hidden bg-[#0a0c10]" style={{ height: 'calc(100vh - 12rem)' }}>
        {/* Thread header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.07] shrink-0 bg-white/[0.02]">
          <button
            onClick={() => { setActiveUserId(null); setActiveUser(null); setMessages([]); loadConversations(); }}
            className="p-1.5 rounded-full text-neutral-500 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#89CFF0]/10 border border-[#89CFF0]/20 flex items-center justify-center text-[#89CFF0] shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{activeUser?.name ?? '...'}</div>
            <div className="text-[10px] text-neutral-500">{activeUser?.email ?? ''}</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0">
          {messages.length === 0 && (
            <div className="text-center text-xs text-neutral-600 py-8">Niciun mesaj încă.</div>
          )}
          {messages.map((msg) => {
            const isAdmin = msg.sender === 'admin';
            return (
              <div key={msg.id} className={`flex flex-col gap-1 ${isAdmin ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isAdmin
                    ? 'bg-[#89CFF0] text-[#07080c] rounded-br-sm'
                    : 'bg-white/[0.08] text-white rounded-bl-sm'
                }`}>
                  {msg.message}
                </div>
                <span className="text-[10px] text-neutral-600 px-1">
                  {isAdmin
                    ? <span className="text-[#89CFF0] mr-1">Tu (admin)</span>
                    : <span className="text-neutral-400 mr-1">{activeUser?.name?.split(' ')[0]}</span>
                  }
                  {formatTime(msg.created_at)}
                </span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Reply input */}
        <form onSubmit={sendReply} className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.07] shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Răspunde lui ${activeUser?.name?.split(' ')[0] ?? ''}...`}
            className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="w-10 h-10 rounded-full bg-[#89CFF0] hover:bg-[#70c4e8] flex items-center justify-center text-[#07080c] disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // ── Conversations list ───────────────────────────────────────────
  return (
    <div>
      {loadingConvs ? (
        <div className="py-16 text-center text-xs text-neutral-500">Se încarcă conversațiile...</div>
      ) : conversations.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-500">
          <Compass className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
          Nicio conversație încă.
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.user_id}
              onClick={() => openThread(conv)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-colors ${
                conv.unread_count > 0
                  ? 'bg-[#89CFF0]/[0.05] border-[#89CFF0]/20 hover:bg-[#89CFF0]/[0.08]'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-neutral-400">
                  <User className="w-4 h-4" />
                </div>
                {conv.unread_count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#89CFF0] text-[#07080c] text-[9px] font-bold flex items-center justify-center">
                    {conv.unread_count > 9 ? '9+' : conv.unread_count}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-semibold truncate ${conv.unread_count > 0 ? 'text-white' : 'text-neutral-300'}`}>
                    {conv.user_name}
                  </span>
                  <span className="text-[10px] text-neutral-600 shrink-0">{formatDate(conv.last_at)}</span>
                </div>
                <p className={`text-xs truncate mt-0.5 ${conv.unread_count > 0 ? 'text-neutral-300 font-medium' : 'text-neutral-500'}`}>
                  {conv.last_sender === 'admin' ? '↩ Tu: ' : ''}{conv.last_message}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
