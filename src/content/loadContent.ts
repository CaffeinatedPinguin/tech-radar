import {contentSchema, type ContentDocument} from '../domain/content';

export async function loadContent(signal?: AbortSignal): Promise<ContentDocument> {
  const response = await fetch('/content/content.json', {signal});
  if (!response.ok) {
    throw new Error(`Content request failed with HTTP ${response.status} ${response.statusText}.`);
  }

  const value: unknown = await response.json();
  const result = contentSchema.safeParse(value);
  if (!result.success) {
    throw new Error('Generated content has an invalid runtime shape. Rebuild the content contract.');
  }

  return result.data;
}
