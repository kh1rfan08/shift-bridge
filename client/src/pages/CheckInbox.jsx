import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';

export default function CheckInbox() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (code.length !== 6) return;
    setVerifying(true);
    setError('');

    try {
      const data = await apiFetch('/auth/verify-code', {
        method: 'POST',
        body: { email, code },
      });
      login(data.token, data.user);
      navigate(data.isNew || !data.user.name ? '/profile' : '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="text-6xl mb-6">&#9993;&#65039;</div>
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-gray-400 mb-6">
          We sent a 6-digit code to<br />
          <span className="text-gray-200 font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            autoFocus
            className="text-center text-3xl font-mono tracking-[0.4em] py-4"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={verifying || code.length !== 6}
            className="w-full bg-pit-accent hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Log In'}
          </button>
        </form>

        <p className="text-gray-500 text-sm mb-4">
          Expires in 15 minutes. Check spam if you don't see it.
        </p>
        <Link to="/login" className="text-pit-accent hover:underline text-sm">
          Use a different email
        </Link>
      </div>
    </div>
  );
}
