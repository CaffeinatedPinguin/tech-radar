export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

export function labelCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
