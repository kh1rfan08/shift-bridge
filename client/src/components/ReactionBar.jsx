import { REACTIONS } from '../lib/constants';
import { apiFetch } from '../api';

export default function ReactionBar({ shiftId, reactions = [], onUpdate }) {
  async function toggle(type) {
    await apiFetch(`/shifts/${shiftId}/reactions`, {
      method: 'POST',
      body: { type },
    });
    onUpdate?.();
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      {REACTIONS.map(r => {
        const data = reactions.find(rx => rx.type === r.type);
        const count = data?.count || 0;
        const mine = data?.mine;

        return (
          <button
            key={r.type}
            onClick={() => toggle(r.type)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors ${
              mine
                ? 'bg-pit-accent/20 border border-pit-accent/40'
                : 'bg-pit-card border border-pit-border hover:border-gray-500'
            }`}
            title={r.label}
          >
            <span>{r.emoji}</span>
            {count > 0 && <span className="text-xs text-gray-400">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
