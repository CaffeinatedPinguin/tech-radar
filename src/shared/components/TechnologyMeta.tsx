import type {Technology} from '../../domain/content';
import {StatusBadge} from './StatusBadge';

export function TechnologyMeta({technology, compact = false}: {technology: Technology; compact?: boolean}) {
  return (
    <div className={compact ? 'technology-meta compact' : 'technology-meta'}>
      <span className="technology-name">{technology.name}</span>
      <span className="technology-area">{technology.area}</span>
      <span className="badge-row">
        <StatusBadge value={technology.ring} />
        <StatusBadge value={technology.usage} kind="usage" />
      </span>
    </div>
  );
}
