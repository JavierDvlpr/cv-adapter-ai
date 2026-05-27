interface TopbarProps {
  status: 'idle' | 'ok' | 'busy' | 'error';
  state: 'idle' | 'ok' | 'busy' | 'error';
  canCopy: boolean;
  onCopy: () => void;
}

export function Topbar({ status, state, canCopy, onCopy }: TopbarProps) {
  const ui = { copy: '⎘ Copy', idle: 'Ready', ok: 'Ready', busy: 'Adapting...', error: 'Error' };

  const statusLabel = ui[status];

  return (
    <div className="topbar">
      <div className="status-pill">
        <div className={`sdot ${state === 'idle' ? '' : state}`.trim()} />
        <span>{statusLabel}</span>
      </div>
      {canCopy ? (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCopy}>
          {ui.copy}
        </button>
      ) : null}
    </div>
  );
}
