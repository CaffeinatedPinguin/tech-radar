import {IconExternalLink} from '@tabler/icons-react';
import {Link, useParams, useSearchParams} from 'react-router-dom';
import {PageHeader} from '../shared/components/PageHeader';
import {EmptyState} from '../shared/components/EmptyState';
import {TechnologyMeta} from '../shared/components/TechnologyMeta';
import {StatusBadge} from '../shared/components/StatusBadge';
import {formatDate} from '../shared/format';
import {useContent} from '../app/content-context';
import {filterTechnologies, filtersFromParams} from '../features/technologies/filters';
import {TechnologyFilters} from '../features/technologies/TechnologyFilters';

export function TechnologiesPage() {
  const content = useContent();
  const [params] = useSearchParams();
  const filters = filtersFromParams(params);
  const technologies = filterTechnologies(content.technologies, filters).sort((a, b) => a.name.localeCompare(b.name));
  return <>
    <PageHeader eyebrow="CATALOG / TECHNOLOGIES" title="Technologies" description="A living view of the tools and platforms shaping the architecture." action={<span className="count-label"><strong>{technologies.length}</strong> of {content.technologies.length}</span>} />
    <TechnologyFilters filters={filters} />
    {technologies.length === 0 ? <EmptyState title="No technologies found" message="Try a broader search or clear one of the filters." /> : <div className="technology-table" role="list" aria-label="Technologies">
      {technologies.map((technology) => <Link className="technology-row" to={`/technologies/${technology.id}`} key={technology.id} role="listitem"><TechnologyMeta technology={technology} /><p>{technology.description}</p><time dateTime={technology.lastReviewed}>Reviewed {formatDate(technology.lastReviewed)}</time><span className="row-arrow">→</span></Link>)}
    </div>}
  </>;
}

export function TechnologyDetailPage() {
  const {technologyId} = useParams();
  const content = useContent();
  const technology = content.technologies.find((item) => item.id === technologyId);
  if (!technology) return <EmptyState title="Technology not found" message="The requested technology is not present in the generated content." />;
  const adrs = content.adrs.filter((adr) => technology.adrs.includes(adr.id));
  return <>
    <Link className="back-link" to="/technologies">← All technologies</Link>
    <section className="detail-hero"><div><span className="eyebrow">TECHNOLOGY</span><h1>{technology.name}</h1><p>{technology.description}</p><div className="badge-row large"><StatusBadge value={technology.ring} /><StatusBadge value={technology.usage} kind="usage" /><span className="technology-area">{technology.area}</span></div></div>{technology.website ? <a className="button outline" href={technology.website} target="_blank" rel="noreferrer noopener">Website <IconExternalLink size={15} /></a> : null}</section>
    <div className="detail-grid"><section className="surface"><div className="section-heading"><div><span className="eyebrow">CHANGE LOG</span><h2>History</h2></div></div><div className="timeline">{technology.history.length ? technology.history.map((entry) => <div className="timeline-item" key={`${entry.date}-${entry.ring}`}><span className="timeline-dot" /><time>{formatDate(entry.date)}</time><div><strong><StatusBadge value={entry.ring} /><StatusBadge value={entry.usage} kind="usage" /></strong>{entry.adr ? <Link to={`/decisions/${entry.adr}`}>{entry.adr}</Link> : null}</div></div>) : <p className="muted">No recorded transitions yet.</p>}</div></section><aside className="surface metadata-card"><span className="eyebrow">REVIEW</span><dl><div><dt>Introduced</dt><dd>{formatDate(technology.introduced)}</dd></div><div><dt>Last reviewed</dt><dd>{formatDate(technology.lastReviewed)}</dd></div><div><dt>Tags</dt><dd><span className="tag-list">{technology.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</span></dd></div></dl></aside></div>
    <div className="detail-grid single-column"><section className="surface"><div className="section-heading"><div><span className="eyebrow">ARCHITECTURE</span><h2>Decisions</h2></div></div>{adrs.length ? <div className="related-list">{adrs.map((adr) => <Link to={`/decisions/${adr.id}`} key={adr.id}><span className="mono">{adr.id}</span><strong>{adr.title}</strong><StatusBadge value={adr.status} kind="status" /></Link>)}</div> : <p className="muted">No linked decisions.</p>}</section></div>
  </>;
}
