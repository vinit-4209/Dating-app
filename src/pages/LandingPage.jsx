import { useState } from 'react';
import { Heart, MessageCircle, Sparkles, Shield, Users, Zap, Star, MapPin, Camera, Clock } from 'lucide-react';


export default function LandingPage() {
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    console.log('Getting started with:', email);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              LoveConnect
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">How it Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">Stories</a>
            <button className="px-6 py-2 text-pink-500 font-semibold hover:bg-pink-50 rounded-full transition-all">
              Log in
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all">
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span className="text-pink-600 font-semibold text-sm">Find Your Perfect Match</span>
              </div>
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Where Real
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"> Connections </span>
                Begin
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join millions finding meaningful relationships through smart matching, genuine profiles, and authentic conversations.
              </p>
              <div className="flex gap-4 mb-8">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors"
                />
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl transition-all hover:scale-105"
                >
                  Get Started
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Verified Profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span>4.8/5 Rating</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mb-4"></div>
                    <h3 className="font-bold text-gray-900 mb-1">Sarah, 28</h3>
                    <p className="text-sm text-gray-600 mb-3">New York</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs rounded-full">Travel</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">Yoga</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 mt-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mb-4"></div>
                    <h3 className="font-bold text-gray-900 mb-1">Michael, 31</h3>
                    <p className="text-sm text-gray-600 mb-3">Los Angeles</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Music</span>
                      <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full">Chef</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mb-4"></div>
                    <h3 className="font-bold text-gray-900 mb-1">Emma, 26</h3>
                    <p className="text-sm text-gray-600 mb-3">Chicago</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">Art</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs rounded-full">Coffee</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 mt-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4"></div>
                    <h3 className="font-bold text-gray-900 mb-1">David, 29</h3>
                    <p className="text-sm text-gray-600 mb-3">Miami</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Beach</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">Fitness</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                5M+
              </div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                2M+
              </div>
              <div className="text-gray-600">Matches Made</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                150+
              </div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                98%
              </div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LoveConnect?</h2>
            <p className="text-xl text-gray-600">Everything you need to find your perfect match</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI-powered algorithm learns your preferences and suggests the most compatible matches based on shared interests and values.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Safe & Secure</h3>
              <p className="text-gray-600 leading-relaxed">
                Your safety is our priority. All profiles are verified, and we use advanced encryption to protect your personal information.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Real Conversations</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect through meaningful conversations with our intuitive messaging features, video calls, and ice-breaker prompts.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Location Based</h3>
              <p className="text-gray-600 leading-relaxed">
                Find matches near you or explore connections around the world. Choose your own adventure in love.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Photo Verification</h3>
              <p className="text-gray-600 leading-relaxed">
                Meet real people with verified photos. No catfishing, no fake profiles - just authentic connections.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Community Events</h3>
              <p className="text-gray-600 leading-relaxed">
                Join local meetups, virtual events, and speed dating sessions to connect with multiple matches at once.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Start your journey in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Your Profile</h3>
              <p className="text-gray-600">
                Share your interests, upload photos, and tell us what you are looking for in a match.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Matched</h3>
              <p className="text-gray-600">
                Browse curated matches based on compatibility, location, and shared interests.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Dating</h3>
              <p className="text-gray-600">
                Connect, chat, and meet up with people who share your values and interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real couples, real love stories</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "I never thought I would find someone who shares my passion for hiking and photography. LoveConnect made it happen! We have been together for 2 years now."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full"></div>
                <div>
                  <div className="font-bold text-gray-900">Jessica & Tom</div>
                  <div className="text-sm text-gray-600">Matched in 2022</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "The smart matching really works! I met my soulmate within the first week. The app understood what I was looking for better than I did."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full"></div>
                <div>
                  <div className="font-bold text-gray-900">Maria & Alex</div>
                  <div className="text-sm text-gray-600">Matched in 2023</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "After trying other apps, LoveConnect was a breath of fresh air. Real people, meaningful conversations. We are getting married next month!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                <div>
                  <div className="font-bold text-gray-900">Ryan & Sophie</div>
                  <div className="text-sm text-gray-600">Matched in 2023</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Find Your Match?</h2>
          <p className="text-xl text-pink-100 mb-8">
            Join millions of singles finding meaningful connections on LoveConnect
          </p>
          <button className="px-12 py-5 bg-white text-pink-600 font-bold text-lg rounded-full hover:shadow-2xl transition-all hover:scale-105">
            Get Started for Free
          </button>
          <p className="text-pink-100 mt-4">No credit card required • Free forever</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                <span className="text-xl font-bold">LoveConnect</span>
              </div>
              <p className="text-gray-400">Making meaningful connections, one match at a time.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <div>About Us</div>
                <div>Careers</div>
                <div>Press</div>
                <div>Blog</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Safety Tips</div>
                <div>Contact Us</div>
                <div>FAQ</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <div className="space-y-2 text-gray-400">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Cookie Policy</div>
                <div>Community Guidelines</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 LoveConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}