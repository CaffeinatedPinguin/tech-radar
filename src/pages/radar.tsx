import {useMemo, useState} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {PageHeader} from '../shared/components/PageHeader';
import {StatusBadge} from '../shared/components/StatusBadge';
import {EmptyState} from '../shared/components/EmptyState';
import {useContent} from '../app/content-context';
import {filterTechnologies, filtersFromParams} from '../features/technologies/filters';
import {TechnologyFilters} from '../features/technologies/TechnologyFilters';
import {RINGS, type Ring, type Technology} from '../domain/content';

type Point = Technology & {x: number; y: number; radius: number};

const ringRadius: Record<Ring, number> = {adopt: 74, trial: 154, assess: 234, hold: 314};
const areaAngles = {development: -45, platform: 45, data: 135, security: 225} as const;

function layoutTechnologies(technologies: Technology[]): Point[] {
  const groups = new Map<string, Technology[]>();
  for (const technology of technologies) {
    const key = `${technology.area}:${technology.ring}`;
    groups.set(key, [...(groups.get(key) ?? []), technology]);
  }
  return [...groups.entries()].flatMap(([key, group]) => {
    const [area, ring] = key.split(':') as [keyof typeof areaAngles, Ring];
    const sorted = [...group].sort((a, b) => a.id.localeCompare(b.id));
    const baseAngle = areaAngles[area] * Math.PI / 180;
    const spread = Math.min(0.55, 0.16 * Math.max(sorted.length - 1, 1));
    return sorted.map((technology, index) => {
      const angle = baseAngle + (index - (sorted.length - 1) / 2) * spread;
      const radius = ringRadius[ring] + ((index % 2) * 14 - 7);
      return {...technology, x: 400 + Math.cos(angle) * radius, y: 350 + Math.sin(angle) * radius, radius: ring === 'adopt' ? 22 : 20};
    });
  });
}

function RadarSvg({technologies, onSelect}: {technologies: Technology[]; onSelect: (technology: Technology) => void}) {
  const points = useMemo(() => layoutTechnologies(technologies), [technologies]);
  return <svg className="radar-svg" viewBox="0 0 800 700" role="img" aria-label="Technology radar with four rings and four areas"><g className="radar-rings">{RINGS.map((ring) => <g key={ring}><circle cx="400" cy="350" r={ringRadius[ring]} /><text x="400" y={350 - ringRadius[ring] + 18}>{ring.toUpperCase()}</text></g>)}</g><line className="radar-axis" x1="400" y1="36" x2="400" y2="664" /><line className="radar-axis" x1="86" y1="350" x2="714" y2="350" /><text className="radar-area-label" x="115" y="64">DEVELOPMENT</text><text className="radar-area-label" x="562" y="64">PLATFORM</text><text className="radar-area-label" x="568" y="650">DATA</text><text className="radar-area-label" x="112" y="650">SECURITY</text>{points.map((point) => <g className="radar-node" key={point.id} tabIndex={0} role="button" aria-label={`${point.name}, ${point.ring}, ${point.usage}`} onClick={() => onSelect(point)} onKeyDown={(event) => {if (event.key === 'Enter' || event.key === ' ') onSelect(point);}}><circle cx={point.x} cy={point.y} r={point.radius} /><text x={point.x} y={point.y + 4}>{point.name}</text></g>)}</svg>;
}

export function RadarPage() {
  const content = useContent();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const filters = filtersFromParams(params);
  const technologies = filterTechnologies(content.technologies, filters);
  const [showRadar, setShowRadar] = useState(true);
  return <>
    <PageHeader eyebrow="OVERVIEW / RADAR" title={content.radar.title} description="A deterministic map of what we use, what we are trying, and what deserves a closer look." action={<span className="count-label"><strong>{technologies.length}</strong> technologies</span>} />
    <TechnologyFilters filters={filters} />
    <div className="mobile-view-toggle"><button className={showRadar ? 'button active' : 'button quiet'} onClick={() => setShowRadar(true)} type="button">Show radar</button><button className={!showRadar ? 'button active' : 'button quiet'} onClick={() => setShowRadar(false)} type="button">Show list</button></div>
    <div className="radar-layout"><section className={showRadar ? 'surface radar-surface' : 'surface radar-surface hide-on-mobile'}><RadarSvg technologies={technologies} onSelect={(technology) => navigate(`/technologies/${technology.id}`)} /></section><section className="surface radar-list"><div className="section-heading"><div><span className="eyebrow">ACCESSIBLE INDEX</span><h2>Technology list</h2></div><span className="muted">{technologies.length} shown</span></div>{technologies.length ? <div className="compact-list">{technologies.sort((a, b) => a.name.localeCompare(b.name)).map((technology) => <Link key={technology.id} to={`/technologies/${technology.id}`}><span><strong>{technology.name}</strong><small>{technology.area}</small></span><span className="badge-row"><StatusBadge value={technology.ring} /><StatusBadge value={technology.usage} kind="usage" /></span></Link>)}</div> : <EmptyState title="No matches" message="Clear the filters to restore the radar." />}</section></div>
  </>;
}
