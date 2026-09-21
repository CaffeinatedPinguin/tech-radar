import {createBrowserRouter, Navigate} from 'react-router-dom';
import {AdrDetailPage, DecisionsPage} from '../pages/decisions';
import {RadarPage} from '../pages/radar';
import {TechnologyDetailPage, TechnologiesPage} from '../pages/technologies';
import {AppShell} from './AppShell';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/radar" replace />,
      },
      {
        path: 'radar',
        element: <RadarPage />,
      },
      {
        path: 'technologies',
        element: <TechnologiesPage />,
      },
      {
        path: 'technologies/:technologyId',
        element: <TechnologyDetailPage />,
      },
      {
        path: 'decisions',
        element: <DecisionsPage />,
      },
      {
        path: 'decisions/:adrId',
        element: <AdrDetailPage />,
      },
      {
        path: '*',
        element: <Navigate to="/radar" replace />,
      },
    ],
  },
]);
