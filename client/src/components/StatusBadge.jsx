import { SHIFT_STATUS } from '../lib/constants';

export default function StatusBadge({ status }) {
  const info = SHIFT_STATUS[status] || SHIFT_STATUS.open;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${info.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'open' ? 'bg-pit-gold animate-pulse' :
        status === 'claimed' ? 'bg-pit-green' : 'bg-gray-500'
      }`} />
      {info.label}
    </span>
  );
}
