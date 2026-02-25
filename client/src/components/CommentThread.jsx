import { useState } from 'react';
import { apiFetch } from '../api';
import Comment from './Comment';

export default function CommentThread({ shiftId, comments = [], onUpdate }) {
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);

    try {
      await apiFetch(`/shifts/${shiftId}/comments`, {
        method: 'POST',
        body: { text: text.trim() },
      });
      setText('');
      onUpdate?.();
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
        Comments ({comments.length})
      </h3>

      {comments.length > 0 ? (
        <div className="divide-y divide-pit-border mb-4">
          {comments.map(c => <Comment key={c.id} comment={c} />)}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-4">No comments yet</p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Say something..."
          className="flex-1 text-sm"
        />
        <button
          type="submit"
          disabled={posting || !text.trim()}
          className="bg-pit-accent hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  );
}
