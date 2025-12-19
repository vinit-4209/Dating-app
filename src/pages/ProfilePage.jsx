import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Edit3, MapPin, MessageCircle, Sparkles, Upload } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../utils/api';

const demoProfile = {
  name: 'You',
  age: 28,
  city: 'Your city',
  pronouns: 'they/them',
  bio: 'Tell people a little about yourself. Add interests, what you are looking for, and your vibe.',
  interests: ['Coffee', 'Live music', 'Hiking'],
  lookingFor: 'relationship',
  height: "5'8\"",
  education: 'Bachelor’s degree',
  occupation: 'Your job',
  photos: []
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(demoProfile);
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('profileData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Unable to parse saved profile', error);
      }
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      getProfile()
        .then(({ profile: remote }) => {
          if (remote) {
            setProfile((prev) => ({ ...prev, ...remote }));
            setSyncStatus('Synced with database.');
          }
        })
        .catch(() => setSyncStatus('Using local profile — server unreachable.'));
    }
  }, []);

  const interestChips = useMemo(() => profile.interests || [], [profile.interests]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-12 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-pink-600 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Your profile is live for matching
            </p>
            <h1 className="text-4xl font-bold text-gray-900">{profile.name || 'Complete your profile'}</h1>
            <p className="text-gray-600">Keep your details fresh so the right matches can find you.</p>
            {syncStatus && <p className="text-xs text-gray-500">{syncStatus}</p>}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/discover')}
              className="px-4 py-2 rounded-full border border-gray-200 text-gray-800 font-semibold hover:bg-white"
            >
              Back to matches
            </button>
            <button
              onClick={() => navigate('/create-profile')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg"
            >
              <Edit3 className="w-4 h-4" />
              Edit profile
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-semibold text-gray-900">
                    {profile.name || 'Your name'}, {profile.age || 'Age'}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {profile.city || 'Add city'}
                  </p>
                  {profile.pronouns && <p className="text-sm text-gray-600">Pronouns: {profile.pronouns}</p>}
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <BadgeCheck className="w-4 h-4" />
                  Verified after email
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{profile.bio || demoProfile.bio}</p>

              <div className="grid sm:grid-cols-2 gap-3">
                <DetailCard label="Looking for" value={profile.lookingFor || 'Add what you are looking for'} />
                <DetailCard label="Height" value={profile.height || 'Add height'} />
                <DetailCard label="Education" value={profile.education || 'Add education'} />
                <DetailCard label="Occupation" value={profile.occupation || 'Add occupation'} />
              </div>

              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {interestChips.length === 0 && <span className="text-gray-500 text-sm">Add interests to personalize your matches.</span>}
                  {interestChips.map((interest) => (
                    <span key={interest} className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-semibold">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Inbox</p>
                  <h3 className="text-lg font-semibold text-gray-900">Your latest conversations</h3>
                </div>
                <button
                  onClick={() => navigate('/discover')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600"
                >
                  <MessageCircle className="w-4 h-4" />
                  View matches
                </button>
              </div>
              <div className="text-gray-600 text-sm">
                Once you both consent to connect, chats will appear here. Keep exploring to start talking.
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
                <button
                  onClick={() => navigate('/create-profile')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600"
                >
                  <Upload className="w-4 h-4" />
                  Update
                </button>
              </div>
              {profile.photos?.length ? (
                <div className="grid grid-cols-2 gap-3">
                  {profile.photos.map((photo, idx) => (
                    <div key={`${photo}-${idx}`} className="aspect-square rounded-2xl overflow-hidden">
                      <img src={photo} alt={`Profile ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-500 text-sm">
                  Add at least 2 photos to help people recognize you in Discover.
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Next steps</h3>
              <button
                onClick={() => navigate('/discover')}
                className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg"
              >
                Start matching
              </button>
              <button
                onClick={() => navigate('/create-profile')}
                className="w-full py-3 rounded-full border border-gray-200 text-gray-800 font-semibold hover:bg-white"
              >
                Improve my profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="border border-gray-100 rounded-2xl p-3">
      <p className="text-xs uppercase text-gray-500 font-semibold mb-1">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}
