export function EmptyState({title, message}: {title: string; message: string}) {
  return (
    <div className="empty-state">
      <span className="empty-state-mark">—</span>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
