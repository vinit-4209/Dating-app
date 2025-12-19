import { useEffect, useMemo, useState } from 'react';
import { Heart, Filter, MessageCircle, ShieldCheck, Check, X, Sparkles, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const profiles = [
  {
    id: 1,
    name: 'Amelia',
    age: 27,
    city: 'New York',
    compatibility: 94,
    interests: ['Hiking', 'Art museums', 'Street food'],
    about: 'Weekend hiker, amateur painter, and obsessed with finding the best dumplings in the city.',
    vibe: 'Looking for slow mornings and spontaneous trips',
    badges: ['Verified', 'Active now']
  },
  {
    id: 2,
    name: 'Noah',
    age: 29,
    city: 'San Francisco',
    compatibility: 88,
    interests: ['Photography', 'Tech', 'Coffee'],
    about: 'Building things by day, photographing sunsets by night. Will trade latte art for travel stories.',
    vibe: 'Ready for thoughtful conversations and city walks',
    badges: ['Verified']
  },
  {
    id: 3,
    name: 'Priya',
    age: 26,
    city: 'Austin',
    compatibility: 91,
    interests: ['Live music', 'Cooking', 'Yoga'],
    about: 'Cookbook collector, live music regular, and the friend who makes sure everyone gets home safe.',
    vibe: 'Looking for someone who values kindness and curiosity',
    badges: ['Verified', 'Recently active']
  },
  {
    id: 4,
    name: 'Leo',
    age: 31,
    city: 'Seattle',
    compatibility: 85,
    interests: ['Climbing', 'Indie films', 'Coffee'],
    about: 'Weekend climber, rainy-day movie buff, and brunch enthusiast. Will bring coffee to any adventure.',
    vibe: 'Let’s swap playlists and plan a day trip',
    badges: []
  },
  {
    id: 5,
    name: 'Maya',
    age: 24,
    city: 'Chicago',
    compatibility: 89,
    interests: ['Dancing', 'Poetry', 'Food markets'],
    about: 'Professional playlist maker and street food scout. I collect moments and favorite lines.',
    vibe: 'Looking for chemistry and consent-driven connections',
    badges: ['Verified']
  }
];

const defaultRequests = [
  {
    id: 'req-1',
    profileId: 5,
    message: 'Maya wants to connect and start a chat once you both agree.'
  }
];

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

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState(profiles[0]);
  const [minCompatibility, setMinCompatibility] = useState(85);
  const [bestMatchesFirst, setBestMatchesFirst] = useState(true);
  const savedConnections = loadConnections();
  const [engagements, setEngagements] = useState(savedConnections?.engagements ?? {});
  const [incomingRequests, setIncomingRequests] = useState(savedConnections?.incomingRequests ?? defaultRequests);
  const [conversations, setConversations] = useState(savedConnections?.conversations ?? {});

  useEffect(() => {
    localStorage.setItem('connections', JSON.stringify({ engagements, incomingRequests, conversations }));
  }, [conversations, engagements, incomingRequests]);

  const sortedProfiles = useMemo(() => {
    const filtered = profiles.filter((profile) => profile.compatibility >= minCompatibility);

    if (bestMatchesFirst) {
      return [...filtered].sort((a, b) => b.compatibility - a.compatibility);
    }

    return filtered;
  }, [bestMatchesFirst, minCompatibility]);

  const statusFor = (id) => engagements[id]?.status ?? 'none';

  const ensureConversation = (profileId, profile) => {
    setConversations((prev) => {
      if (prev[profileId]?.length) return prev;

      return {
        ...prev,
        [profileId]: [
          {
            from: 'them',
            text: `Hi! ${profile?.name ?? 'New match'} accepted your request. Start the chat when you are ready.`,
            timestamp: new Date().toISOString()
          }
        ]
      };
    });
  };

  useEffect(() => {
    Object.values(engagements).forEach((entry) => {
      if (entry.status === 'accepted' && entry.with?.id) {
        ensureConversation(entry.with.id, entry.with);
      }
    });
  }, [engagements]);

  const sendRequest = (profile) => {
    if (statusFor(profile.id) !== 'none') return;

    setEngagements((prev) => ({
      ...prev,
      [profile.id]: {
        status: 'pending',
        with: profile
      }
    }));
  };

  const acceptRequest = (request) => {
    setIncomingRequests((prev) => prev.filter((item) => item.id !== request.id));
    setEngagements((prev) => ({
      ...prev,
      [request.profileId]: {
        status: 'accepted',
        with: profiles.find((p) => p.id === request.profileId) || { id: request.profileId }
      }
    }));

    const profile = profiles.find((p) => p.id === request.profileId);
    ensureConversation(request.profileId, profile);
  };

  const declineRequest = (request) => {
    setIncomingRequests((prev) => prev.filter((item) => item.id !== request.id));
  };

  const canChat = (profile) => statusFor(profile.id) === 'accepted';

  const openChat = (profile) => {
    if (!canChat(profile)) return;

    ensureConversation(profile.id, profile);
    localStorage.setItem('activeChatWith', String(profile.id));
    navigate('/chat');
  };

  const conversationForSelected = conversations[selectedProfile.id] ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-pink-600 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Smart matching is ready
            </p>
            <h1 className="text-4xl font-bold text-gray-900">Discover people near you</h1>
            <p className="text-gray-600">Filter top matches, send a like request, and chat only when consent is mutual.</p>
          </div>
          <button
            onClick={() => navigate('/create-profile')}
            className="px-4 py-2 text-sm font-semibold text-pink-600 hover:text-pink-700"
          >
            Edit profile
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white shadow-lg rounded-3xl p-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-semibold text-gray-800">Filters</span>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                Minimum match {minCompatibility}%
                <input
                  type="range"
                  min="75"
                  max="99"
                  value={minCompatibility}
                  onChange={(e) => setMinCompatibility(Number(e.target.value))}
                  className="w-32 accent-pink-500"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-pink-500"
                  checked={bestMatchesFirst}
                  onChange={(e) => setBestMatchesFirst(e.target.checked)}
                />
                Show best matches first
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {sortedProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile)}
                  className={`text-left bg-white rounded-3xl p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border ${
                    selectedProfile?.id === profile.id ? 'border-pink-400' : 'border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.name}, {profile.age}
                      </p>
                      <p className="text-sm text-gray-500">{profile.city}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">
                      {profile.compatibility}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-3 line-clamp-2">{profile.about}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.interests.map((interest) => (
                      <span key={interest} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        {interest}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
                    {profile.badges.includes('Verified') && (
                      <span className="flex items-center gap-1">
                        <BadgeCheck className="w-4 h-4 text-green-500" /> Verified profile
                      </span>
                    )}
                    {profile.badges.includes('Active now') && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full">Active now</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Focused view</p>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedProfile.name}, {selectedProfile.age}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedProfile.city}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">
                  {selectedProfile.compatibility}% compatible
                </span>
              </div>

              <p className="mt-4 text-gray-700 leading-relaxed">{selectedProfile.about}</p>
              <div className="mt-3 p-3 bg-gray-50 rounded-2xl text-sm text-gray-700">
                <strong className="text-gray-900">Vibe:</strong> {selectedProfile.vibe}
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Shared interests</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.interests.map((interest) => (
                    <span key={interest} className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-semibold">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => sendRequest(selectedProfile)}
                  disabled={statusFor(selectedProfile.id) !== 'none'}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Heart className="w-5 h-5" />
                  {statusFor(selectedProfile.id) === 'none' && 'Send like request'}
                  {statusFor(selectedProfile.id) === 'pending' && 'Request sent · waiting for consent'}
                  {statusFor(selectedProfile.id) === 'accepted' && 'Connected · start chatting'}
                </button>

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Consent-first: chat unlocks only when both people agree.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Requests & consent</h3>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                  {incomingRequests.length} waiting
                </span>
              </div>

              {incomingRequests.length === 0 && (
                <p className="text-sm text-gray-600">No pending requests. Likes you send will appear here when they respond.</p>
              )}

              {incomingRequests.map((request) => {
                const profile = profiles.find((p) => p.id === request.profileId);

                return (
                  <div key={request.id} className="border border-gray-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{profile?.name ?? 'New connection'} wants to chat</p>
                        <p className="text-sm text-gray-600">{request.message}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">Consent needed</span>
                    </div>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => acceptRequest(request)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
                      >
                        <Check className="w-4 h-4" /> Accept & unlock chat
                      </button>
                      <button
                        onClick={() => declineRequest(request)}
                        className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-semibold"
                      >
                        <X className="w-4 h-4" /> Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-900">Chat preview</h3>
                <span className="text-xs text-gray-500">Consent required first</span>
              </div>

              {selectedProfile && canChat(selectedProfile) ? (
                <div className="space-y-3">
                  {(conversationForSelected.length
                    ? conversationForSelected
                    : [
                        { from: selectedProfile.name, text: 'Thanks for accepting! Want to grab coffee this weekend?' },
                        { from: 'You', text: 'Absolutely! Saturday afternoon works great for me.' }
                      ]
                  ).map((message, idx) => (
                    <div
                      key={`${selectedProfile.id}-${idx}`}
                      className={`${
                        message.from === 'You' ? 'bg-white border border-gray-100' : 'bg-pink-50'
                      } p-3 rounded-2xl text-sm text-gray-800`}
                    >
                      <p className="font-semibold">{message.from}</p>
                      <p>{message.text}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => openChat(selectedProfile)}
                    className="w-full py-2 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600"
                  >
                    Continue chat
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-800">Consent protected</p>
                  <p>
                    Send a like first. Chat unlocks automatically once your request is accepted so both people opt in before any
                    conversation begins.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
