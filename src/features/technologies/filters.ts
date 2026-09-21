import type {AreaId, Ring, Technology, Usage} from '../../domain/content';

export type TechnologyFilters = {q: string; area: AreaId | 'all'; ring: Ring | 'all'; usage: Usage | 'all'};

export function filtersFromParams(params: URLSearchParams): TechnologyFilters {
  const area = params.get('area');
  const ring = params.get('ring');
  const usage = params.get('usage');
  return {
    q: params.get('q')?.trim() ?? '',
    area: area && ['development', 'platform', 'data', 'security'].includes(area) ? area as AreaId : 'all',
    ring: ring && ['adopt', 'trial', 'assess', 'hold'].includes(ring) ? ring as Ring : 'all',
    usage: usage && ['current', 'candidate', 'previous'].includes(usage) ? usage as Usage : 'all',
  };
}

export function searchableTechnology(technology: Technology): string {
  return [technology.name, technology.description, ...technology.tags].join(' ').toLowerCase().trim();
}

export function filterTechnologies(technologies: Technology[], filters: TechnologyFilters): Technology[] {
  const query = filters.q.toLowerCase();
  return technologies.filter((technology) => {
    if (filters.area !== 'all' && technology.area !== filters.area) return false;
    if (filters.ring !== 'all' && technology.ring !== filters.ring) return false;
    if (filters.usage !== 'all' && technology.usage !== filters.usage) return false;
    return !query || searchableTechnology(technology).includes(query);
  });
}
