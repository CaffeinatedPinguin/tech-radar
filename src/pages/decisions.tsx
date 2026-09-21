import {IconArrowUpRight, IconCheck, IconCircleCheck, IconCircleX} from '@tabler/icons-react';
import {Link, useParams} from 'react-router-dom';
import {useContent} from '../app/content-context';
import {EmptyState} from '../shared/components/EmptyState';
import {PageHeader} from '../shared/components/PageHeader';
import {StatusBadge} from '../shared/components/StatusBadge';
import {formatDate} from '../shared/format';

export function DecisionsPage() {
  const content = useContent();
  const adrs = [...content.adrs].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader
        eyebrow="CATALOG / DECISIONS"
        title="Architecture decisions"
        description="Structured records of the choices, trade-offs and revisit conditions behind the radar."
        action={<span className="count-label"><strong>{adrs.length}</strong> records</span>}
      />
      <div className="decision-list">
        {adrs.map((adr) => (
          <Link className="decision-row surface" to={`/decisions/${adr.id}`} key={adr.id}>
            <div className="decision-id mono">{adr.id}</div>
            <div className="decision-main">
              <div className="decision-title-line">
                <h2>{adr.title}</h2>
                <StatusBadge value={adr.status} kind="status" />
              </div>
              <p>{adr.decision}</p>
              <div className="decision-footer">
                <time>{formatDate(adr.date)}</time>
                <span>{adr.technologies.length} technologies</span>
                {adr.supersededBy ? <span>Superseded by {adr.supersededBy}</span> : null}
              </div>
            </div>
            <IconArrowUpRight className="row-arrow" size={19} />
          </Link>
        ))}
      </div>
    </>
  );
}

export function AdrDetailPage() {
  const {adrId} = useParams();
  const content = useContent();
  const adr = content.adrs.find((item) => item.id === adrId);

  if (!adr) {
    return <EmptyState title="Decision not found" message="The requested ADR is not present in the generated content." />;
  }

  const technologies = content.technologies.filter((technology) => adr.technologies.includes(technology.id));

  return (
    <>
      <Link className="back-link" to="/decisions">← All decisions</Link>
      <section className="detail-hero decision-hero">
        <div>
          <span className="eyebrow mono">{adr.id}</span>
          <h1>{adr.title}</h1>
          <div className="badge-row large">
            <StatusBadge value={adr.status} kind="status" />
            <time>{formatDate(adr.date)}</time>
          </div>
        </div>
      </section>
      <div className="adr-layout">
        <article className="surface adr-body">
          <section>
            <h2>Context</h2>
            <p className="long-copy">{adr.context}</p>
          </section>
          <section>
            <h2>Decision</h2>
            <p className="long-copy emphasis">{adr.decision}</p>
          </section>
          <section>
            <h2>Alternatives considered</h2>
            <div className="alternatives">
              {adr.alternatives.map((alternative) => (
                <div className="alternative" key={alternative.name}>
                  <strong>{alternative.name}</strong>
                  <p>{alternative.reason}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="consequence-grid">
            <div>
              <h2><IconCircleCheck size={18} /> Positive</h2>
              <ul className="clean-list positive">
                {adr.consequences.positive.map((item) => (
                  <li key={item}><IconCheck size={16} />{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2><IconCircleX size={18} /> Negative</h2>
              <ul className="clean-list negative">
                {adr.consequences.negative.map((item) => (
                  <li key={item}><IconCircleX size={16} />{item}</li>
                ))}
              </ul>
            </div>
          </section>
          <section>
            <h2>Revisit when</h2>
            <ul className="clean-list">
              {adr.revisitWhen.map((item) => (
                <li key={item}><span className="list-marker" />{item}</li>
              ))}
            </ul>
          </section>
        </article>
        <aside className="adr-sidebar">
          <section className="surface">
            <span className="eyebrow">TECHNOLOGIES</span>
            <div className="related-list">
              {technologies.map((technology) => (
                <Link to={`/technologies/${technology.id}`} key={technology.id}>
                  <strong>{technology.name}</strong>
                  <span>{technology.area}</span>
                </Link>
              ))}
            </div>
          </section>
          {adr.supersedes || adr.supersededBy ? (
            <section className="surface relationship-card">
              <span className="eyebrow">RELATIONSHIP</span>
              {adr.supersedes ? <Link to={`/decisions/${adr.supersedes}`}>Supersedes <strong>{adr.supersedes}</strong></Link> : null}
              {adr.supersededBy ? <Link to={`/decisions/${adr.supersededBy}`}>Superseded by <strong>{adr.supersededBy}</strong></Link> : null}
            </section>
          ) : null}
          {adr.links.length ? (
            <section className="surface">
              <span className="eyebrow">SOURCE LINKS</span>
              <div className="related-list">
                {adr.links.map((link) => (
                  <a href={link.url} target="_blank" rel="noreferrer noopener" key={link.url}>
                    {link.label}
                    <IconArrowUpRight size={15} />
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </>
  );
}
