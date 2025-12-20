import { useEffect, useMemo, useState } from 'react';
import {
  Heart,
  Filter,
  MessageCircle,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  BadgeCheck,
  MapPin,
  Waves,
  Music2,
  ChefHat,
  Trees,
  CircleDot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getDiscover, getMatches, getProfile, requestMatch, respondMatch } from '../utils/api';

const profiles = [
  {
    id: 1,
    name: 'Amelia',
    age: 27,
    city: 'New York',
    location: { latitude: 40.7128, longitude: -74.006 },
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ],
    compatibility: 94,
    interests: ['Hiking', 'Art museums', 'Street food'],
    about: 'Weekend hiker, amateur painter, and obsessed with finding the best dumplings in the city.',
    vibe: 'Looking for slow mornings and spontaneous trips',
    badges: ['Verified', 'Active now'],
    isOnline: true
  },
  {
    id: 2,
    name: 'Noah',
    age: 29,
    city: 'San Francisco',
    location: { latitude: 37.7749, longitude: -122.4194 },
    photos: [
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80'
    ],
    compatibility: 88,
    interests: ['Photography', 'Tech', 'Coffee'],
    about: 'Building things by day, photographing sunsets by night. Will trade latte art for travel stories.',
    vibe: 'Ready for thoughtful conversations and city walks',
    badges: ['Verified'],
    isOnline: false
  },
  {
    id: 3,
    name: 'Priya',
    age: 26,
    city: 'Austin',
    location: { latitude: 30.2672, longitude: -97.7431 },
    photos: [
      'https://images.unsplash.com/photo-1530785602389-07594beb8b75?auto=format&fit=crop&w=800&q=80'
    ],
    compatibility: 91,
    interests: ['Live music', 'Cooking', 'Yoga'],
    about: 'Cookbook collector, live music regular, and the friend who makes sure everyone gets home safe.',
    vibe: 'Looking for someone who values kindness and curiosity',
    badges: ['Verified', 'Recently active'],
    isOnline: true
  },
  {
    id: 4,
    name: 'Leo',
    age: 31,
    city: 'Seattle',
    location: { latitude: 47.6062, longitude: -122.3321 },
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ],
    compatibility: 85,
    interests: ['Climbing', 'Indie films', 'Coffee'],
    about: 'Weekend climber, rainy-day movie buff, and brunch enthusiast. Will bring coffee to any adventure.',
    vibe: 'Let’s swap playlists and plan a day trip',
    badges: [],
    isOnline: true
  },
  {
    id: 5,
    name: 'Maya',
    age: 24,
    city: 'Chicago',
    location: { latitude: 41.8781, longitude: -87.6298 },
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ],
    compatibility: 89,
    interests: ['Dancing', 'Poetry', 'Food markets'],
    about: 'Professional playlist maker and street food scout. I collect moments and favorite lines.',
    vibe: 'Looking for chemistry and consent-driven connections',
    badges: ['Verified'],
    isOnline: false
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
  const [remoteProfiles, setRemoteProfiles] = useState(profiles);
  const [minCompatibility, setMinCompatibility] = useState(85);
  const [bestMatchesFirst, setBestMatchesFirst] = useState(true);
  const [maxDistanceKm, setMaxDistanceKm] = useState(50);
  const [ageRange, setAgeRange] = useState([22, 38]);
  const [interestFilters, setInterestFilters] = useState([]);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [viewerLocation, setViewerLocation] = useState(null);
  const savedConnections = loadConnections();
  const [engagements, setEngagements] = useState(savedConnections?.engagements ?? {});
  const [incomingRequests, setIncomingRequests] = useState(savedConnections?.incomingRequests ?? defaultRequests);
  const [conversations, setConversations] = useState(savedConnections?.conversations ?? {});
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;

  const viewerId = useMemo(() => {
    if (!token) return null;
    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload));
      return decoded.id || null;
    } catch (error) {
      console.error('Unable to decode token', error);
      return null;
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('connections', JSON.stringify({ engagements, incomingRequests, conversations }));
  }, [conversations, engagements, incomingRequests]);

  useEffect(() => {
    if (!token) return;

    getDiscover()
      .then(({ profiles: fetched }) => {
        if (Array.isArray(fetched) && fetched.length) {
          const normalized = fetched.map((profile) => ({
            ...profile,
            id: profile.userId || profile._id,
            isOnline: profile.isOnline ?? false,
            interests: profile.interests || [],
            photos: profile.photos || [],
            compatibility: profile.compatibility ?? 90
          }));
          setRemoteProfiles(normalized);
          setSelectedProfile(normalized[0]);
        }
      })
      .catch((error) => console.error('Unable to load discovery profiles', error));
  }, [token]);

  useEffect(() => {
    if (!token) return;

    getProfile()
      .then(({ profile }) => {
        if (profile?.location?.latitude && profile?.location?.longitude) {
          setViewerLocation({
            latitude: profile.location.latitude,
            longitude: profile.location.longitude
          });
        }
      })
      .catch((error) => console.error('Unable to load viewer profile', error));
  }, [token]);

  useEffect(() => {
    if (!token) return;

    getMatches()
      .then(({ matches }) => {
        const map = {};
        const requests = [];
        matches.forEach((match) => {
          const partner = match.with ? { ...match.with, id: match.with.id } : null;
          if (partner) {
            map[partner.id] = { status: match.status, with: partner, matchId: match._id, requestedBy: match.requestedBy };
            if (match.status === 'pending' && match.requestedBy !== viewerId) {
              requests.push({ id: match._id, profileId: partner.id, message: `${partner.name || 'Someone'} wants to connect.` });
            }
          }
        });
        setEngagements(map);
        if (requests.length) {
          setIncomingRequests(requests);
        }
      })
      .catch((error) => console.error('Unable to sync matches', error));
  }, [token, viewerId]);

  const calculateDistanceKm = (from, to) => {
    if (!from || !to?.latitude || !to?.longitude) return null;

    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(to.latitude - from.latitude);
    const dLon = toRad(to.longitude - from.longitude);
    const lat1 = toRad(from.latitude);
    const lat2 = toRad(to.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  };

  const sortedProfiles = useMemo(() => {
    const pool = remoteProfiles?.length ? remoteProfiles : profiles;
    const augmented = pool.map((profile) => ({
      ...profile,
      distanceKm: calculateDistanceKm(viewerLocation, profile.location)
    }));

    const filtered = augmented.filter((profile) => {
      const meetsCompatibility = profile.compatibility >= minCompatibility;
      const meetsAge = profile.age ? profile.age >= ageRange[0] && profile.age <= ageRange[1] : true;
      const meetsOnline = onlineOnly ? profile.isOnline : true;
      const meetsInterests =
        interestFilters.length === 0 || interestFilters.some((interest) => profile.interests?.includes(interest));
      const meetsDistance =
        profile.distanceKm == null || Number.isNaN(profile.distanceKm) || profile.distanceKm <= maxDistanceKm;

      return meetsCompatibility && meetsAge && meetsOnline && meetsInterests && meetsDistance;
    });

    if (bestMatchesFirst) {
      return [...filtered].sort((a, b) => b.compatibility - a.compatibility);
    }

    return filtered;
  }, [ageRange, bestMatchesFirst, interestFilters, maxDistanceKm, minCompatibility, onlineOnly, viewerLocation]);

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

    if (token && profile.id) {
      requestMatch(profile.id).catch((error) => console.error('Unable to send request', error));
    }

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
        with: remoteProfiles.find((p) => p.id === request.profileId) || profiles.find((p) => p.id === request.profileId) || { id: request.profileId }
      }
    }));

    if (token && request.id) {
      respondMatch(request.id, 'accept').catch((error) => console.error('Unable to accept request', error));
    }

    const profile = remoteProfiles.find((p) => p.id === request.profileId) || profiles.find((p) => p.id === request.profileId);
    ensureConversation(request.profileId, profile);
  };

  const declineRequest = (request) => {
    setIncomingRequests((prev) => prev.filter((item) => item.id !== request.id));
    if (token && request.id) {
      respondMatch(request.id, 'decline').catch((error) => console.error('Unable to decline request', error));
    }
  };

  const canChat = (profile) => statusFor(profile.id) === 'accepted';

  const openChat = (profile) => {
    if (!canChat(profile)) return;

    ensureConversation(profile.id, profile);
    localStorage.setItem('activeChatWith', String(profile.id));
    navigate('/chat');
  };

  const conversationForSelected = conversations[selectedProfile?.id] ?? [];

  const toggleInterest = (interest) => {
    setInterestFilters((prev) =>
      prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest]
    );
  };

  const primaryPhoto = (profile) => profile.photos?.[0];

  const formatDistance = (distanceKm) => {
    if (distanceKm == null || Number.isNaN(distanceKm)) return 'Distance unknown';
    if (distanceKm < 1) return '<1 km away';
    return `${distanceKm} km away`;
  };

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
              <label className="flex items-center gap-2 text-sm text-gray-600">
                Distance up to {maxDistanceKm} km
                <input
                  type="range"
                  min="5"
                  max="150"
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                  className="w-32 accent-pink-500"
                />
              </label>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                Age range
                <input
                  type="number"
                  min="18"
                  max={ageRange[1]}
                  value={ageRange[0]}
                  onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])}
                  className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-sm"
                />
                <span className="text-gray-400">–</span>
                <input
                  type="number"
                  min={ageRange[0]}
                  max="70"
                  value={ageRange[1]}
                  onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])}
                  className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-sm"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-pink-500"
                  checked={bestMatchesFirst}
                  onChange={(e) => setBestMatchesFirst(e.target.checked)}
                />
                Show best matches first
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-pink-500"
                  checked={onlineOnly}
                  onChange={(e) => setOnlineOnly(e.target.checked)}
                />
                Show only online now
              </label>
            </div>

            <div className="bg-white shadow-lg rounded-3xl p-4 flex flex-wrap gap-2">
              {[{ label: 'Music', icon: Music2 }, { label: 'Art', icon: Waves }, { label: 'Foodie', icon: ChefHat }, { label: 'Outdoors', icon: Trees }].map(
                ({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => toggleInterest(label)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-semibold transition-colors ${
                      interestFilters.includes(label)
                        ? 'bg-pink-100 text-pink-700 border-pink-200'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                )
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {sortedProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`relative text-left bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border ${
                    selectedProfile?.id === profile.id ? 'border-pink-400' : 'border-transparent'
                  }`}
                >
                  <button onClick={() => setSelectedProfile(profile)} className="w-full text-left">
                    <div className="relative h-56 w-full bg-gray-100">
                      {primaryPhoto(profile) ? (
                        <img src={primaryPhoto(profile)} alt={`${profile.name} profile`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-pink-100 to-purple-100" />
                      )}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        {profile.isOnline && <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"><CircleDot className="w-3 h-3" /> Online</span>}
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-800">
                          <MapPin className="w-3 h-3" /> {profile.city}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-pink-700 shadow">
                          <Heart className="w-4 h-4" /> {profile.compatibility}%
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {profile.name}, {profile.age}
                          </p>
                          <p className="text-sm text-gray-500">{formatDistance(profile.distanceKm)}</p>
                        </div>
                        {profile.badges?.includes('Verified') && <BadgeCheck className="w-5 h-5 text-green-500" />}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{profile.about}</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.slice(0, 4).map((interest) => (
                          <span key={interest} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => sendRequest(profile)}
                      disabled={statusFor(profile.id) !== 'none'}
                      className={`flex items-center justify-center rounded-full p-3 shadow-lg transition ${
                        statusFor(profile.id) === 'none'
                          ? 'bg-white text-pink-600 hover:bg-pink-50'
                          : statusFor(profile.id) === 'pending'
                          ? 'bg-orange-50 text-orange-500'
                          : 'bg-green-50 text-green-600'
                      }`}
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="relative h-64 w-full bg-gray-100">
                {primaryPhoto(selectedProfile) ? (
                  <img
                    src={primaryPhoto(selectedProfile)}
                    alt={`${selectedProfile.name} profile large`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-pink-100 to-purple-200" />
                )}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="bg-white/90 backdrop-blur rounded-2xl px-4 py-2 shadow">
                    <p className="text-xl font-bold text-gray-900">
                      {selectedProfile.name}, {selectedProfile.age}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-pink-500" /> {selectedProfile.city}
                    </p>
                  </div>
                  <button
                    onClick={() => sendRequest(selectedProfile)}
                    disabled={statusFor(selectedProfile.id) !== 'none'}
                    className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-pink-600 font-semibold shadow hover:bg-white"
                  >
                    <Heart className="w-5 h-5" />
                    {statusFor(selectedProfile.id) === 'none'
                      ? 'Like'
                      : statusFor(selectedProfile.id) === 'pending'
                      ? 'Pending'
                      : 'Matched'}
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">
                    {selectedProfile.compatibility}% compatible
                  </span>
                  <span className="text-sm text-gray-600">{formatDistance(selectedProfile.distanceKm)}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{selectedProfile.about}</p>
                <div className="p-3 bg-gray-50 rounded-2xl text-sm text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <strong className="text-gray-900">Vibe:</strong> {selectedProfile.vibe}
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.interests.map((interest) => (
                      <span key={interest} className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-semibold">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {selectedProfile.isOnline && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      <CircleDot className="w-3 h-3" /> Online now
                    </span>
                  )}
                  {selectedProfile.badges?.includes('Verified') && (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <BadgeCheck className="w-4 h-4" /> Verified profile
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-3">
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
                const profile = (remoteProfiles?.length ? remoteProfiles : profiles).find((p) => p.id === request.profileId);

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
