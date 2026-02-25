import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';
import { UNITS } from '../lib/constants';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const isOnboarding = !user?.name;

  const [name, setName] = useState(user?.name || '');
  const [units, setUnits] = useState(user?.units || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function toggleUnit(unit) {
    setUnits(prev => prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit]);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) { setError('Name required'); return; }
    setSaving(true);
    setError('');

    try {
      const data = await apiFetch('/users/me', {
        method: 'PUT',
        body: { name: name.trim(), units, shift_types: [] },
      });
      updateUser(data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">
          {isOnboarding ? 'Quick \u2014 who are you?' : 'Your Profile'}
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          {isOnboarding ? 'Takes 10 seconds. Promise.' : 'Update your info'}
        </p>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Your name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sarah K."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Your units</label>
            <div className="flex flex-wrap gap-2">
              {UNITS.map(unit => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => toggleUnit(unit)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    units.includes(unit)
                      ? 'bg-pit-accent text-white'
                      : 'bg-pit-card text-gray-400 border border-pit-border'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-pit-accent hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : isOnboarding ? "Let's go" : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}
