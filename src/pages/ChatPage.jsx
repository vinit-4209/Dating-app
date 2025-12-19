import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, MessageCircle, Send, ShieldCheck, Sparkles, User } from 'lucide-react';
import Navbar from '../components/Navbar';

const loadConnections = () => {
  if (typeof localStorage === 'undefined') return null;

  const saved = localStorage.getItem('connections');
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error('Unable to parse saved connections', error);
    return null;
  }
};

const defaultMessage = {
  from: 'them',
  text: 'Thanks for connecting! Want to pick a time to chat this week?',
  timestamp: new Date().toISOString()
};

export default function ChatPage() {
  const saved = loadConnections();
  const [engagements, setEngagements] = useState(saved?.engagements ?? {});
  const [conversations, setConversations] = useState(saved?.conversations ?? {});
  const [activeChatId, setActiveChatId] = useState(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('activeChatWith') : null;
    return stored ?? null;
  });
  const [draftMessage, setDraftMessage] = useState('');

  const matches = useMemo(() => {
    return Object.values(engagements).filter((entry) => entry.status === 'accepted');
  }, [engagements]);

  useEffect(() => {
    localStorage.setItem('connections', JSON.stringify({ engagements, conversations, incomingRequests: saved?.incomingRequests ?? [] }));
  }, [engagements, conversations]);

  useEffect(() => {
    if (!activeChatId && matches.length) {
      const first = matches[0].with?.id ?? null;
      setActiveChatId(first ? String(first) : null);
    }
  }, [activeChatId, matches]);

  const activeProfile = useMemo(() => {
    return matches.find((match) => String(match.with?.id) === String(activeChatId))?.with;
  }, [activeChatId, matches]);

  const messages = conversations[activeChatId] ?? (activeChatId ? [defaultMessage] : []);

  const selectChat = (id) => {
    if (!id) return;
    setActiveChatId(String(id));
    localStorage.setItem('activeChatWith', String(id));
  };

  const sendMessage = () => {
    if (!draftMessage.trim() || !activeChatId) return;

    const timestamp = new Date().toISOString();
    setConversations((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] ?? [defaultMessage]), { from: 'you', text: draftMessage.trim(), timestamp }]
    }));
    setDraftMessage('');
  };

  const consentedCount = matches.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-12">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-sm text-pink-600 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Chat with people who accepted your request
            </p>
            <h1 className="text-4xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">Consent keeps conversations safe. Only mutual matches can chat.</p>
          </div>
          <div className="bg-white shadow-md rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            {consentedCount} consented match{consentedCount === 1 ? '' : 'es'}
          </div>
        </div>

        <div className="grid md:grid-cols-[320px_1fr] gap-6">
          <div className="bg-white rounded-3xl shadow-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageCircle className="w-4 h-4 text-pink-500" />
              Inbox
            </div>
            {matches.length === 0 ? (
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-semibold text-gray-800">No conversations yet</p>
                <p>Send requests in Discover and once they accept, you can start talking here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((match) => {
                  const isActive = String(match.with?.id) === String(activeChatId);
                  return (
                    <button
                      key={match.with?.id ?? match.status}
                      onClick={() => selectChat(match.with?.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all hover:-translate-y-0.5 ${
                        isActive ? 'border-pink-400 bg-pink-50 shadow-md' : 'border-gray-100 bg-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-pink-600 font-semibold">
                            {match.with?.name?.[0] ?? 'M'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{match.with?.name ?? 'New match'}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                              Consent granted
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">Accepted</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 min-h-[480px] flex flex-col">
            {activeProfile ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-pink-600 font-semibold">
                      {activeProfile.name?.[0] ?? 'M'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{activeProfile.name ?? 'Match'}</p>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        Consent-locked chat
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {messages?.length ?? 0} messages
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {messages.map((message, idx) => (
                    <div
                      key={message.timestamp ?? idx}
                      className={`max-w-[80%] p-3 rounded-2xl text-sm shadow ${
                        message.from === 'you'
                          ? 'ml-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                          : 'bg-gray-50 text-gray-800'
                      }`}
                    >
                      <p className="font-semibold mb-1">{message.from === 'you' ? 'You' : activeProfile.name ?? 'Match'}</p>
                      <p>{message.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <input
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Say hi and suggest a plan"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-pink-400"
                  />
                  <button
                    onClick={sendMessage}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-600 space-y-3 m-auto">
                <div className="mx-auto w-14 h-14 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                  <User className="w-7 h-7" />
                </div>
                <p className="text-lg font-semibold text-gray-900">No active chat</p>
                <p className="text-sm">Accept or send a request in Discover. Once both sides consent, the chat will unlock here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
