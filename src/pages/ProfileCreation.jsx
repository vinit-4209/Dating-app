import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { saveProfile } from '../utils/api';

export default function CreateProfile() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    pronouns: '',
    interestsText: '',
    bio: '',
    interests: [],
    lookingFor: '',
    height: '',
    education: '',
    occupation: '',
    latitude: '',
    longitude: ''
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/auth?mode=login');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await handleFiles(files);
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Unable to read file.'));
      reader.readAsDataURL(file);
    });

  const reverseGeocode = async (latitude, longitude) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );

    if (!res.ok) {
      throw new Error('Unable to resolve location name.');
    }

    const data = await res.json();
    const address = data.address || {};
    return (
      address.city ||
      address.town ||
      address.village ||
      address.state ||
      data.display_name ||
      ''
    );
  };

  const handleFiles = async (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    const remainingSlots = Math.max(0, 6 - photos.length);
    const limitedFiles = imageFiles.slice(0, remainingSlots);

    const newPhotos = await Promise.all(
      limitedFiles.map(async (file) => {
        const dataUrl = await readFileAsDataUrl(file);
        return {
          id: Date.now() + Math.random(),
          url: dataUrl,
          fileName: file.name
        };
      })
    );

    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 6));
  };

  const removePhoto = (id) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/auth?mode=login');
    }
  };

  const requestLocationAccess = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('Requesting permission to access your location...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({ ...prev, latitude, longitude }));
        setLocationStatus('Location captured. Fetching place name...');

        try {
          const locationName = await reverseGeocode(latitude, longitude);
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            city: locationName || prev.city
          }));
          setLocationStatus(
            locationName ? `Location set to ${locationName}.` : 'Location captured successfully.'
          );
        } catch (error) {
          setLocationStatus('Location captured, but unable to resolve the place name automatically.');
        }
      },
      () => {
        setLocationStatus('Unable to access location. Please enable permissions and try again.');
      }
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      return;
    }

    const { interestsText, latitude, longitude, ...rest } = formData;

    const locationPayload = latitude && longitude
      ? { location: { latitude: Number(latitude), longitude: Number(longitude) } }
      : {};

    const derivedInterests = interestsText
      ? interestsText
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : formData.interests;

    const payload = {
      ...rest,
      ...locationPayload,
      interests: derivedInterests,
      photos: photos.map((photo) => photo.url)
    };

    localStorage.setItem('profileData', JSON.stringify(payload));

    const token = localStorage.getItem('authToken');

    if (token) {
      saveProfile(payload)
        .then(() => {
          setStatus('Profile saved to the server.');
          navigate('/discover');
        })
        .catch(() => {
          setStatus('Saved locally, but unable to reach the server.');
          navigate('/discover');
        });
    } else {
      setStatus('Saved locally. Log in to sync with the server.');
      navigate('/discover');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      <Navbar />
      <div className="w-full max-w-5xl mx-auto px-4 pt-24 pb-10 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {status && (
          <div className="mb-4 rounded-xl bg-blue-50 text-blue-800 px-4 py-3 text-sm font-semibold border border-blue-100">
            {status}
          </div>
        )}
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create your profile</h1>
            <p className="text-gray-500 text-lg">Step {currentStep} of {totalSteps}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/auth?mode=login')}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all"
            >
              Back to login
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            {/* Name and Age */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>
              <div className="w-32">
                <label className="block text-gray-700 font-semibold mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>
            </div>

            {/* City and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Precise location</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={requestLocationAccess}
                    className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg"
                  >
                    Use current location
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {locationStatus || 'Allow location access so we can store your coordinates with your profile.'}
                </p>
                {(formData.latitude || formData.longitude) && (
                  <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-700">
                    <span className="px-3 py-2 bg-gray-100 rounded-full">Lat: {formData.latitude}</span>
                    <span className="px-3 py-2 bg-gray-100 rounded-full">Lng: {formData.longitude}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pronouns */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Pronouns</label>
              <input
                type="text"
                name="pronouns"
                placeholder="e.g., she/her, he/him, they/them"
                value={formData.pronouns}
                onChange={handleInputChange}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors"
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Interests</label>
              <input
                type="text"
                name="interestsText"
                placeholder="e.g., hiking, coffee, museums"
                value={formData.interestsText}
                onChange={handleInputChange}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors"
              />
              <p className="text-sm text-gray-500 mt-2">Separate with commas to help us match you on what you love.</p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Bio</label>
              <textarea
                name="bio"
                placeholder="Coffee lover, hiker, and aspiring chef. Looking for someone to explore the city with."
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-3xl focus:outline-none focus:border-pink-400 transition-colors resize-none"
              />
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Height</label>
                <input
                  type="text"
                  name="height"
                  placeholder="e.g., 5'8"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Looking for</label>
                <select
                  name="lookingFor"
                  value={formData.lookingFor}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors bg-white"
                >
                  <option value="">Select</option>
                  <option value="relationship">Relationship</option>
                  <option value="friendship">Friendship</option>
                  <option value="casual">Casual</option>
                  <option value="open">Open to anything</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors"
              />
            </div>
          </div>

          {/* Right Column - Photo Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-4">Photos</label>
            
            {/* Drag and Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-4 border-dashed border-gray-300 rounded-3xl p-12 text-center mb-6 hover:border-pink-400 transition-colors cursor-pointer"
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" strokeWidth={1.5} />
              <p className="text-gray-600 text-lg">Drag and drop to add photos</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
            </div>

            {/* Photo Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mb-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                    <img
                      src={photo.url}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label
              htmlFor="photo-upload"
              className="block w-full bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 text-white py-4 rounded-full font-semibold text-lg text-center shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              Upload from device
            </label>

            <p className="text-gray-500 text-sm text-center mt-4">
              You can update your photos anytime
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={handleBack}
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-12 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
