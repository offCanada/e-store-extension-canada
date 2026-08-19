const LEVELS = [
  { key: 'not_important', label: 'None' },
  { key: 'important', label: 'Low' },
  { key: 'very_important', label: 'Medium' },
  { key: 'mandatory', label: 'High' },
];

const LABELS: Record<string, string> = {
  nutriScore: 'Nutri-Score',
  low_fat: 'Low Fat',
  low_salt: 'Low Salt',
  low_sugar: 'Low Sugar',
  low_saturated_fat: 'Low Saturated Fat',
  novaScore: 'NOVA Group',
  ecoScore: 'Green-Score',
};

interface PrefGroupProps<T extends Record<string, string>> {
  label: string;
  state: T;
  onChange: (value: T | ((prev: T) => T)) => void;
}

const PrefGroup = <T extends Record<string, string>>({
  label,
  state,
  onChange,
}: PrefGroupProps<T>) => {
  const attrs = Object.keys(state);
  return (
    <div class="mb-3">
      <p class="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">{label}</p>
      {attrs.map((attr) => (
        <div key={attr} class="flex items-center justify-between py-1 gap-2">
          <span class="text-xs text-gray-800 min-w-18">{LABELS[attr]}</span>
          <div class="flex gap-1">
            {LEVELS.map((lv) => (
              <button
                key={lv.key}
                onClick={() => onChange({ ...state, [attr]: lv.key })}
                class={`text-[11px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer
                                ${
                                  state[attr] === lv.key
                                    ? 'bg-amber-500 text-white border-amber-500'
                                    : 'bg-gray-50 text-gray-500 border-gray-200'
                                }`}
              >
                {lv.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrefGroup;
