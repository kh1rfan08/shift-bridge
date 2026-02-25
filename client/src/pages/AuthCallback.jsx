import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('No token provided');
      return;
    }

    apiFetch(`/auth/verify?token=${token}`)
      .then(data => {
        login(data.token, data.user);
        if (data.isNew || !data.user.name) {
          navigate('/profile', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      })
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <a href="/login" className="text-pit-accent hover:underline">Try again</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Signing you in...</p>
    </div>
  );
}
