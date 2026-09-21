import {useEffect, useState} from 'react';
import {RouterProvider} from 'react-router-dom';
import {loadContent} from '../content/loadContent';
import {ContentContext} from './content-context';
import {router} from './router';

export function App() {
  const [content, setContent] = useState<Awaited<ReturnType<typeof loadContent>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    loadContent(controller.signal).then(setContent).catch((reason: unknown) => {
      if (reason instanceof DOMException && reason.name === 'AbortError') {
        return;
      }

      setError(reason instanceof Error ? reason.message : 'Content could not be loaded.');
    });
    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <main className="load-state">
        <h1>Tech Radar unavailable</h1>
        <p>{error}</p>
        <p>Run <code>npm run content:build</code> and reload.</p>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="load-state">
        <span className="eyebrow">SMRODEK / TECH RADAR</span>
        <h1>Loading architecture map…</h1>
        <p>Reading the generated content contract.</p>
      </main>
    );
  }

  return (
    <ContentContext.Provider value={content}>
      <RouterProvider router={router} />
    </ContentContext.Provider>
  );
}
