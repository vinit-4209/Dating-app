import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState({ type: 'pending', message: 'Verifying your email...' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus({ type: 'error', message: 'Verification token missing. Please use the link in your email.' });
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify?token=${token}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Verification failed.');
        }
        setStatus({ type: 'success', message: data.message });
        setTimeout(() => navigate('/auth?mode=login'), 1800);
      } catch (error) {
        setStatus({ type: 'error', message: error.message });
      }
    };

    verify();
  }, [navigate, searchParams]);

  const statusStyles = {
    pending: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    error: 'bg-red-50 text-red-700 border border-red-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Email verification</h1>
        <p className={`rounded-xl px-4 py-3 text-base font-semibold ${statusStyles[status.type]}`}>
          {status.message}
        </p>
        <p className="text-gray-600 mt-4">You will be redirected to the login page once verification succeeds.</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/auth?mode=login')}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Go to login
          </button>
        </div>
      </div>
    </div>
  );
}
