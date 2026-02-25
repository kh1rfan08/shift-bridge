import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api';
import ShiftCard from '../components/ShiftCard';
import EmptyPit from '../components/EmptyPit';

export default function ThePit() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open');

  const loadShifts = useCallback(async () => {
    try {
      const params = filter ? `?status=${filter}` : '';
      const data = await apiFetch(`/shifts${params}`);
      setShifts(data.shifts);
    } catch (err) {
      console.error('Failed to load shifts:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { loadShifts(); }, [loadShifts]);

  return (
    <div className="pb-20">
      <header className="sticky top-0 bg-pit-bg/95 backdrop-blur z-10 px-4 py-3 border-b border-pit-border">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-xl font-bold">The Pit</h1>
          <div className="flex gap-1 bg-pit-card rounded-lg p-0.5">
            {['open', 'claimed', ''].map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setLoading(true); }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === f ? 'bg-pit-accent text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {f === '' ? 'All' : f === 'open' ? 'Open' : 'Claimed'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-pit-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : shifts.length === 0 ? (
          <EmptyPit />
        ) : (
          shifts.map(shift => (
            <ShiftCard key={shift.id} shift={shift} onUpdate={loadShifts} />
          ))
        )}
      </div>
    </div>
  );
}
