import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';
import { UNITS } from '../lib/constants';
import TimeBlockPicker from '../components/TimeBlockPicker';

export default function PostShift() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [unit, setUnit] = useState(user?.units?.[0] || '');
  const [note, setNote] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date || !startTime || !endTime || !unit) {
      setError('Pick a date, time, and unit');
      return;
    }
    setPosting(true);
    setError('');

    try {
      await apiFetch('/shifts', {
        method: 'POST',
        body: { date, start_time: startTime, end_time: endTime, unit, note: note.trim() || undefined },
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="pb-20">
      <header className="sticky top-0 bg-pit-bg/95 backdrop-blur z-10 px-4 py-3 border-b border-pit-border safe-top">
        <h1 className="text-xl font-bold max-w-lg mx-auto">Post a Shift</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            min={today}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Shift time</label>
          <TimeBlockPicker
            startTime={startTime}
            endTime={endTime}
            onSelect={(s, e) => { setStartTime(s); setEndTime(e); }}
          />
          <div className="flex gap-3 mt-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Custom start</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Custom end</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Unit</label>
          <div className="flex flex-wrap gap-2">
            {UNITS.map(u => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  unit === u
                    ? 'bg-pit-accent text-white'
                    : 'bg-pit-card border border-pit-border text-gray-400 hover:border-gray-500'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Note (optional)</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Any details..."
            rows={2}
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={posting}
          className="w-full bg-pit-gold hover:bg-amber-600 text-black font-bold py-4 rounded-xl text-lg transition-colors disabled:opacity-50"
        >
          {posting ? 'Posting...' : 'Throw in the Pit'}
        </button>
      </form>
    </div>
  );
}
