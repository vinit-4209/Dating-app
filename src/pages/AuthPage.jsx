import { useState } from 'react';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('signup');
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateAccount = () => {
    setShowVerification(true);
  };

  const handleLogin = () => {
    console.log('Login submitted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        {/* Aspect Ratio Indicator */}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700 shadow-md z-10">
          16:9
        </div>

        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {/* Tab Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setActiveTab('signup');
                setShowVerification(false);
              }}
              className={`px-8 py-3 rounded-full font-semibold text-lg transition-all ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => {
                setActiveTab('login');
                setShowVerification(false);
              }}
              className={`px-8 py-3 rounded-full font-semibold text-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
            >
              Log in
            </button>
          </div>

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors text-gray-700"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors text-gray-700"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors text-gray-700"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors text-gray-700"
              />
              
              <button
                onClick={handleCreateAccount}
                className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 mt-6"
              >
                Create account
              </button>

              <p className="text-center text-gray-600 text-sm mt-4">
                By continuing you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  guidelines
                </a>
              </p>

              <p className="text-center text-gray-700 mt-4">
                Already have an account?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Log in
                </button>
              </p>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors text-gray-700"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors text-gray-700"
              />
              
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 mt-6"
              >
                Log in
              </button>

              <p className="text-center text-gray-700 mt-4">
                Don't have an account?{' '}
                <button
                  onClick={() => setActiveTab('signup')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Right Section - Image & Verification */}
        <div className="w-full md:w-1/2 relative bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-pink-200/30 to-blue-200/30" />
            <div className="absolute text-center">
              <div className="w-64 h-64 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 blur-3xl" />
            </div>
          </div>

          {/* Verification Card */}
          {showVerification && (
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 m-8 max-w-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Check your email
              </h2>
              <p className="text-gray-600 mb-6">
                We sent a verification link to{' '}
                <span className="font-semibold">{formData.email || 'alex@mail.com'}</span>. Please
                confirm to finish creating your account.
              </p>
              
              <button className="text-blue-600 font-semibold hover:underline mb-4 block">
                Resend email
              </button>
              
              <button className="w-full border-2 border-pink-500 text-pink-600 py-3 rounded-full font-semibold hover:bg-pink-50 transition-all">
                Change email
              </button>

              <p className="text-gray-500 text-sm mt-6 text-center">
                Email verification helps keep this space safe
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}