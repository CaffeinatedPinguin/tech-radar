import {IconAdjustments, IconSearch, IconX} from '@tabler/icons-react';
import {useSearchParams} from 'react-router-dom';
import type {TechnologyFilters} from './filters';
import {AREAS, RINGS, USAGES} from '../../domain/content';
import {labelCase} from '../../shared/format';

export function TechnologyFilters({filters}: {filters: TechnologyFilters}) {
  const [params, setParams] = useSearchParams();
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'all') next.set(key, value); else next.delete(key);
    setParams(next);
  };
  const clear = () => setParams(new URLSearchParams());
  const hasFilters = Boolean(filters.q || filters.area !== 'all' || filters.ring !== 'all' || filters.usage !== 'all');
  return <div className="filters-panel" aria-label="Technology filters">
    <div className="search-field"><IconSearch size={18} /><input value={filters.q} onChange={(event) => update('q', event.target.value)} placeholder="Search name, tag or description" aria-label="Search technologies" /></div>
    <div className="filter-selects">
      <label>Area<select value={filters.area} onChange={(event) => update('area', event.target.value)}><option value="all">All areas</option>{AREAS.map((area) => <option key={area} value={area}>{labelCase(area)}</option>)}</select></label>
      <label>Ring<select value={filters.ring} onChange={(event) => update('ring', event.target.value)}><option value="all">All rings</option>{RINGS.map((ring) => <option key={ring} value={ring}>{labelCase(ring)}</option>)}</select></label>
      <label>Usage<select value={filters.usage} onChange={(event) => update('usage', event.target.value)}><option value="all">All usage</option>{USAGES.map((usage) => <option key={usage} value={usage}>{labelCase(usage)}</option>)}</select></label>
    </div>
    {hasFilters ? <button className="button quiet" type="button" onClick={clear}><IconX size={16} />Clear filters</button> : <span className="filter-hint"><IconAdjustments size={15} />Filters are shareable in the URL</span>}
  </div>;
}
