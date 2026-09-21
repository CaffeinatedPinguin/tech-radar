import {AREAS, RINGS, USAGES, type AreaId, type Ring, type Technology, type Usage} from '../../domain/content';

export type TechnologyFilters = {
  q: string;
  area: AreaId | 'all';
  ring: Ring | 'all';
  usage: Usage | 'all';
};

function valueFromParams<T extends string>(value: string | null, allowedValues: readonly T[]): T | 'all' {
  if (value && allowedValues.includes(value as T)) {
    return value as T;
  }

  return 'all';
}

export function filtersFromParams(params: URLSearchParams): TechnologyFilters {
  return {
    q: params.get('q')?.trim() ?? '',
    area: valueFromParams(params.get('area'), AREAS),
    ring: valueFromParams(params.get('ring'), RINGS),
    usage: valueFromParams(params.get('usage'), USAGES),
  };
}

export function searchableTechnology(technology: Technology): string {
  return [technology.name, technology.description, ...technology.tags].join(' ').toLowerCase().trim();
}

export function filterTechnologies(technologies: Technology[], filters: TechnologyFilters): Technology[] {
  const query = filters.q.toLowerCase();

  return technologies.filter((technology) => {
    if (filters.area !== 'all' && technology.area !== filters.area) {
      return false;
    }

    if (filters.ring !== 'all' && technology.ring !== filters.ring) {
      return false;
    }

    if (filters.usage !== 'all' && technology.usage !== filters.usage) {
      return false;
    }

    return !query || searchableTechnology(technology).includes(query);
  });
}
