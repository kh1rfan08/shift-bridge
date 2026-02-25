import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';
import StatusBadge from '../components/StatusBadge';
import ReactionBar from '../components/ReactionBar';
import CommentThread from '../components/CommentThread';
import { formatDate, formatTime, timeAgo } from '../lib/timeUtils';

export default function ShiftDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch(`/shifts/${id}`);
      setShift(data.shift);
    } catch {
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { load(); }, [load]);

  async function handleClaim() {
    setActing(true);
    try {
      await apiFetch(`/shifts/${id}/claim`, { method: 'POST' });
      load();
    } finally { setActing(false); }
  }

  async function handleUnclaim() {
    setActing(true);
    try {
      await apiFetch(`/shifts/${id}/claim`, { method: 'DELETE' });
      load();
    } finally { setActing(false); }
  }

  async function handleDelete() {
    if (!confirm('Delete this shift?')) return;
    setActing(true);
    try {
      await apiFetch(`/shifts/${id}`, { method: 'DELETE' });
      navigate('/', { replace: true });
    } finally { setActing(false); }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pit-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!shift) return null;

  const isOwner = shift.posted_by === user?.id;
  const isClaimer = shift.claimed_by === user?.id;
  const canClaim = shift.status === 'open' && !isOwner;
  const canDelete = isOwner && shift.status !== 'claimed';
  const posterName = shift.poster_name || shift.poster_email?.split('@')[0] || 'Someone';

  return (
    <div className="pb-20">
      <header className="sticky top-0 bg-pit-bg/95 backdrop-blur z-10 px-4 py-3 border-b border-pit-border">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Shift Details</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="bg-pit-card border border-pit-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <StatusBadge status={shift.status} />
            <span className="text-gray-500 text-xs">{timeAgo(shift.created_at)}</span>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">
              Posted by <span className="text-gray-200 font-medium">{posterName}</span>
            </p>
            <div className="text-2xl font-bold">
              {formatDate(shift.date)} &middot; {formatTime(shift.start_time)}&ndash;{formatTime(shift.end_time)}
            </div>
            <span className="inline-block bg-pit-bg px-3 py-1 rounded-md text-sm font-medium text-gray-300 mt-2">
              {shift.unit}
            </span>
          </div>

          {shift.note && (
            <p className="text-gray-400">{shift.note}</p>
          )}

          {shift.status === 'claimed' && shift.claimer_name && (
            <p className="text-pit-green font-medium">
              Covered by {shift.claimer_name}
            </p>
          )}

          <ReactionBar shiftId={shift.id} reactions={shift.reactions} onUpdate={load} />

          <div className="flex gap-3 pt-2">
            {canClaim && (
              <button
                onClick={handleClaim}
                disabled={acting}
                className="flex-1 bg-pit-green hover:bg-green-600 text-black font-bold py-3 rounded-xl text-lg transition-colors disabled:opacity-50"
              >
                I got this
              </button>
            )}
            {isClaimer && (
              <button
                onClick={handleUnclaim}
                disabled={acting}
                className="flex-1 bg-pit-card border border-pit-border text-gray-300 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                Unclaim
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={acting}
                className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl font-medium transition-colors hover:bg-red-500/20 disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <CommentThread shiftId={shift.id} comments={shift.comments} onUpdate={load} />
      </div>
    </div>
  );
}
