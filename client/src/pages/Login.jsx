import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSending(true);

    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: { email },
      });
      navigate('/check-inbox', { state: { email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-sky-500/20">
            &#9877;
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ShiftBridge
          </h1>
          <p className="text-gray-400 mt-1">Sign in with your email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="you@hospital.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            className="text-lg"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-pit-accent hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 text-lg"
          >
            {sending ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <p className="text-gray-500 text-xs text-center mt-6">
          We'll email you a link to sign in. No password needed.
        </p>
      </div>
    </div>
  );
}
