import {labelCase} from '../format';

export function StatusBadge({value, kind = 'ring'}: {value: string; kind?: 'ring' | 'usage' | 'status'}) {
  return <span className={`status-badge ${kind}-${value}`}><span className="status-dot" />{labelCase(value)}</span>;
}
