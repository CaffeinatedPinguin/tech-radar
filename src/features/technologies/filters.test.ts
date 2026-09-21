import {describe, expect, it} from 'vitest';
import type {Technology} from '../../domain/content';
import {filterTechnologies, filtersFromParams, searchableTechnology} from './filters';

const technologies: Technology[] = [
  {
    id: 'zabbix',
    name: 'Zabbix',
    area: 'security',
    ring: 'adopt',
    usage: 'current',
    description: 'Central monitoring',
    introduced: '2026-01-01',
    lastReviewed: '2026-01-02',
    tags: ['monitoring'],
    replaces: [],
    replacedBy: [],
    history: [],
    adrs: [],
  },
  {
    id: 'redis',
    name: 'Redis',
    area: 'data',
    ring: 'trial',
    usage: 'candidate',
    description: 'In-memory cache',
    introduced: '2026-01-01',
    lastReviewed: '2026-01-02',
    tags: ['cache'],
    replaces: [],
    replacedBy: [],
    history: [],
    adrs: [],
  },
];

describe('technology filters', () => {
  it('matches name, description and tags case-insensitively', () => {
    expect(filterTechnologies(technologies, {q: 'CACHE', area: 'all', ring: 'all', usage: 'all'}).map((item) => item.id)).toEqual(['redis']);
    expect(searchableTechnology(technologies[0])).toContain('monitoring');
  });

  it('combines area, ring and usage filters', () => {
    expect(filterTechnologies(technologies, {q: '', area: 'security', ring: 'adopt', usage: 'current'}).map((item) => item.id)).toEqual(['zabbix']);
    expect(filterTechnologies(technologies, {q: '', area: 'data', ring: 'adopt', usage: 'all'})).toEqual([]);
  });

  it('parses only supported URL values', () => {
    const filters = filtersFromParams(new URLSearchParams('q=zabbix&ring=adopt&usage=unknown&area=invalid'));
    expect(filters).toEqual({q: 'zabbix', ring: 'adopt', usage: 'all', area: 'all'});
  });
});
