import { timeAgo } from '../lib/timeUtils';

export default function Comment({ comment }) {
  const name = comment.user_name || comment.user_email?.split('@')[0] || 'Someone';

  return (
    <div className="py-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-gray-200">{name}</span>
        <span className="text-xs text-gray-500">{timeAgo(comment.created_at)}</span>
      </div>
      <p className="text-sm text-gray-300">{comment.text}</p>
    </div>
  );
}
