import {createContext, useContext} from 'react';
import type {ContentDocument} from '../domain/content';

export const ContentContext = createContext<ContentDocument | null>(null);

export function useContent(): ContentDocument {
  const content = useContext(ContentContext);
  if (!content) {
    throw new Error('useContent must be used inside ContentContext.');
  }

  return content;
}
