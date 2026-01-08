import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, HeartHandshake, MapPin, MessageCircle, Sparkles, UserCheck, UserPlus, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getDiscover, getMatches, getProfile, requestMatch, respondMatch } from '../utils/api';

const extractPhotoUrls = (photos = []) => {
  if (!Array.isArray(photos)) return [];
  return photos.map((photo) => (typeof photo === 'string' ? photo : photo.url)).filter(Boolean);
};

const normalizeProfileId = (profile) => {
  return profile?.userId ?? profile?.id ?? profile?._id ?? profile?.with?.id ?? profile?.with?.userId ?? null;
};

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [matchMap, setMatchMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [actioningId, setActioningId] = useState(null);
  const [hasProfile, setHasProfile] = useState(true);

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  const viewerId = useMemo(() => {
    if (!token) return null;
    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload));
      return decoded.id || null;
    } catch (error) {
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/auth?mode=login');
      return;
    }

    let isMounted = true;

    const loadDiscover = async () => {
      setLoading(true);
      const [discoverResult, matchResult, profileResult] = await Promise.allSettled([
        getDiscover(),
        getMatches(),
        getProfile()
      ]);

      if (!isMounted) return;

      if (profileResult.status === 'fulfilled') {
        if (!profileResult.value.profile) {
          setHasProfile(false);
        }
      } else {
        setStatusMessage('Unable to verify your profile details.');
      }

      if (discoverResult.status === 'fulfilled') {
        setProfiles(discoverResult.value.profiles || []);
      } else {
        setProfiles([]);
        setStatusMessage('Unable to load new profiles right now.');
      }

      if (matchResult.status === 'fulfilled') {
        const nextMap = {};
        (matchResult.value.matches || []).forEach((match) => {
          const profileId = normalizeProfileId(match.with);
          if (!profileId) return;
          nextMap[String(profileId)] = {
            status: match.status,
            requestedBy: match.requestedBy,
            matchId: match._id,
            with: match.with
          };
        });
        setMatchMap(nextMap);
      }

      setLoading(false);
    };

    loadDiscover();

    return () => {
      isMounted = false;
    };
  }, [navigate, token]);

  const incomingRequests = useMemo(() => {
    if (!viewerId) return [];
    return Object.entries(matchMap)
      .filter(([, match]) => match.status === 'pending' && String(match.requestedBy) !== String(viewerId))
      .map(([id, match]) => ({ id, match }));
  }, [matchMap, viewerId]);

  const outgoingRequests = useMemo(() => {
    if (!viewerId) return [];
    return Object.entries(matchMap)
      .filter(([, match]) => match.status === 'pending' && String(match.requestedBy) === String(viewerId))
      .map(([id, match]) => ({ id, match }));
  }, [matchMap, viewerId]);

  const acceptedMatches = useMemo(() => {
    return Object.values(matchMap).filter((match) => match.status === 'accepted');
  }, [matchMap]);

  const handleRequest = async (profile) => {
    const targetId = normalizeProfileId(profile);
    if (!targetId) return;
    setActioningId(String(targetId));

    try {
      const { match } = await requestMatch(targetId);
      setMatchMap((prev) => ({
        ...prev,
        [String(targetId)]: {
          status: match.status,
          requestedBy: match.requestedBy,
          matchId: match._id,
          with: profile
        }
      }));
      setStatusMessage('Match request sent!');
    } catch (error) {
      setStatusMessage('Unable to send request right now.');
    } finally {
      setActioningId(null);
    }
  };

  const handleRespond = async (profileId, matchId, action) => {
    if (!matchId) return;
    setActioningId(String(profileId));

    try {
      const { match } = await respondMatch(matchId, action);
      setMatchMap((prev) => {
        const existing = prev[String(profileId)];
        if (!existing) return prev;
        return {
          ...prev,
          [String(profileId)]: {
            ...existing,
            status: match.status
          }
        };
      });
      setStatusMessage(action === 'accept' ? 'Match accepted! Start chatting now.' : 'Request declined.');
    } catch (error) {
      setStatusMessage('Unable to update match right now.');
    } finally {
      setActioningId(null);
    }
  };

  const renderAction = (profile) => {
    const profileId = normalizeProfileId(profile);
    if (!profileId) return null;
    const match = matchMap[String(profileId)];
    const isBusy = actioningId === String(profileId);

    if (!match) {
      return (
        <button
          onClick={() => handleRequest(profile)}
          disabled={isBusy}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-60"
        >
          <UserPlus className="w-4 h-4" />
          Send request
        </button>
      );
    }

    if (match.status === 'accepted') {
      return (
        <button
          onClick={() => navigate('/chat')}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white font-semibold shadow-md hover:bg-green-600"
        >
          <MessageCircle className="w-4 h-4" />
          Chat now
        </button>
      );
    }

    if (match.status === 'declined') {
      return (
        <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-500 font-semibold">
          <XCircle className="w-4 h-4" />
          Not a match
        </div>
      );
    }

    const isIncoming = String(match.requestedBy) !== String(viewerId);

    if (isIncoming) {
      return (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleRespond(profileId, match.matchId, 'accept')}
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-semibold shadow-md hover:bg-green-600 disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4" />
            Accept
          </button>
          <button
            onClick={() => handleRespond(profileId, match.matchId, 'decline')}
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 disabled:opacity-60"
          >
            <XCircle className="w-4 h-4" />
            Decline
          </button>
        </div>
      );
    }

    return (
      <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-pink-50 text-pink-700 font-semibold">
        <Clock className="w-4 h-4" />
        Request sent
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-12 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-sm text-pink-600 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Discover people who match your vibe
            </p>
            <h1 className="text-4xl font-bold text-gray-900">Discover</h1>
            <p className="text-gray-600">Browse curated profiles and send thoughtful requests to connect.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white shadow-md rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-pink-500" />
              {acceptedMatches.length} consented match{acceptedMatches.length === 1 ? '' : 'es'}
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 rounded-full border border-gray-200 text-gray-800 font-semibold hover:bg-white"
            >
              View profile
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm text-gray-700">{statusMessage}</div>
        )}

        {!hasProfile && (
          <div className="rounded-3xl border border-pink-100 bg-white p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-gray-900">Finish your profile to unlock matches</p>
              <p className="text-sm text-gray-600">Add photos and details so we can surface better connections.</p>
            </div>
            <button
              onClick={() => navigate('/create-profile')}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md"
            >
              <UserCheck className="w-4 h-4" />
              Complete profile
            </button>
          </div>
        )}

        {incomingRequests.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requests waiting for you</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {incomingRequests.map(({ id, match }) => {
                const profile = match.with || {};
                const photos = extractPhotoUrls(profile.photos);
                return (
                  <div key={id} className="border border-gray-100 rounded-2xl p-4 flex gap-4">
                    <div className="w-20 h-24 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400">
                      {photos[0] ? (
                        <img src={photos[0]} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-semibold">{profile.name?.[0] ?? 'U'}</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="font-semibold text-gray-900">{profile.name ?? 'New connection'}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {profile.city || 'Location hidden'}
                        </p>
                      </div>
                      {renderAction(profile)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center text-gray-600">Loading your matches...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile, index) => {
              const photos = extractPhotoUrls(profile.photos);
              const profileId = normalizeProfileId(profile) ?? profile.id ?? profile.email;
              const match = profileId ? matchMap[String(profileId)] : null;
              const cardKey = profileId ?? profile.email ?? `${profile.name ?? 'profile'}-${index}`;

              return (
                <div key={cardKey} className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
                  <div className="relative">
                    <div className="aspect-[4/5] bg-gray-100">
                      {photos[0] ? (
                        <img src={photos[0]} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-semibold text-gray-300">
                          {profile.name?.[0] ?? 'U'}
                        </div>
                      )}
                    </div>
                    {match?.status === 'accepted' && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Matched
                      </div>
                    )}
                    {match?.status === 'pending' && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-4 flex-1 flex flex-col">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {profile.name ?? 'New profile'} {profile.age ? `• ${profile.age}` : ''}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.city || 'Location hidden'}
                      </p>
                      {profile.pronouns && <p className="text-xs text-gray-400">{profile.pronouns}</p>}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{profile.bio || 'Say hi and start the conversation.'}</p>
                    <div className="flex flex-wrap gap-2">
                      {(profile.interests || []).slice(0, 4).map((interest) => (
                        <span key={interest} className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold">
                          {interest}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto">{renderAction(profile)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && profiles.length === 0 && (
          <div className="text-center text-gray-600">No new profiles yet. Check back soon for more matches.</div>
        )}

        {outgoingRequests.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requests you sent</h2>
            <div className="flex flex-wrap gap-3">
              {outgoingRequests.map(({ id, match }) => (
                <div key={id} className="px-4 py-2 rounded-full bg-pink-50 text-pink-700 text-sm font-semibold">
                  {match.with?.name ?? 'Someone'} • pending
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
