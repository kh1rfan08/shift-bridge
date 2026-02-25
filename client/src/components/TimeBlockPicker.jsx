import { TIME_PRESETS } from '../lib/constants';

export default function TimeBlockPicker({ startTime, endTime, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TIME_PRESETS.map(preset => {
        const active = startTime === preset.start && endTime === preset.end;
        return (
          <button
            key={preset.label}
            type="button"
            onClick={() => onSelect(preset.start, preset.end)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              active
                ? 'bg-pit-accent text-white'
                : 'bg-pit-card border border-pit-border text-gray-300 hover:border-gray-500'
            }`}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}
