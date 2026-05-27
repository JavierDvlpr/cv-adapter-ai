export interface OptionButton<T extends string> {
  value: T;
  label: string;
  preview?: string;
  fontFamily?: string;
}

interface OptionButtonsProps<T extends string> {
  label: string;
  options: Array<OptionButton<T>>;
  value: T;
  onChange: (value: T) => void;
  columns?: 1 | 2 | 3;
}

export function OptionButtons<T extends string>({ label, options, value, onChange, columns = 2 }: OptionButtonsProps<T>) {
  return (
    <div className="sb-section">
      <div className="sb-label">{label}</div>
      <div className={`button-grid cols-${columns}`}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`choice-btn ${option.value === value ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
            style={option.fontFamily ? { fontFamily: option.fontFamily } : undefined}
          >
            <span className="choice-btn-label">{option.label}</span>
            {option.preview ? <span className="choice-btn-preview">{option.preview}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
