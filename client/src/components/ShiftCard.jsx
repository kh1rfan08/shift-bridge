import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import ReactionBar from './ReactionBar';
import { formatDate, formatTime, timeAgo } from '../lib/timeUtils';

export default function ShiftCard({ shift, onUpdate }) {
  const displayName = shift.poster_name || shift.poster_email?.split('@')[0] || 'Someone';

  return (
    <div className="bg-pit-card border border-pit-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={shift.status} />
            <span className="text-gray-500 text-xs">{timeAgo(shift.created_at)}</span>
          </div>
          <p className="text-sm text-gray-400">
            <span className="text-gray-200 font-medium">{displayName}</span> needs coverage
          </p>
        </div>
        <span className="bg-pit-bg px-2 py-0.5 rounded text-xs font-medium text-gray-300">
          {shift.unit}
        </span>
      </div>

      <div className="flex items-center gap-3 text-lg font-semibold">
        <span>{formatDate(shift.date)}</span>
        <span className="text-gray-500">&middot;</span>
        <span>{formatTime(shift.start_time)}&ndash;{formatTime(shift.end_time)}</span>
      </div>

      {shift.note && (
        <p className="text-gray-400 text-sm">{shift.note}</p>
      )}

      {shift.status === 'claimed' && shift.claimer_name && (
        <p className="text-pit-green text-sm font-medium">
          Covered by {shift.claimer_name}
        </p>
      )}

      <ReactionBar shiftId={shift.id} reactions={shift.reactions} onUpdate={onUpdate} />

      <Link
        to={`/shifts/${shift.id}`}
        className="block text-center text-sm text-gray-500 hover:text-gray-300 pt-1"
      >
        {shift.comment_count > 0 ? `${shift.comment_count} comment${shift.comment_count > 1 ? 's' : ''}` : 'View details'}
      </Link>
    </div>
  );
}
