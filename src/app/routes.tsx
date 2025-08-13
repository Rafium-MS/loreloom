import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Skeleton from './core/ui/Skeleton';

const EditorPage = lazy(() => import('../modules/editor/pages/EditorPage'));
const BookManagerPage = lazy(() => import('../modules/book/pages/BookManagerPage'));
const CharactersPage = lazy(() => import('../modules/characters/pages/CharactersPage'));
const WorldBuilderPage = lazy(() => import('../modules/world/pages/WorldBuilderPage'));
const LocationsPage = lazy(() => import('../modules/world/pages/LocationsPage'));
const LocationDetailPage = lazy(() => import('../modules/world/pages/LocationDetailPage'));
const PlotManagerPage = lazy(() => import('../modules/plot/pages/PlotManagerPage'));
const MagicSystemPage = lazy(() => import('../modules/magic/pages/MagicSystemPage'));
const TechSystemPage = lazy(() => import('../modules/tech/pages/TechSystemPage'));
const TimelinePage = lazy(() => import('../modules/timeline/pages/TimelinePage'));
const RelationshipVisualizerPage = lazy(
  () => import('../modules/relationships/pages/RelationshipVisualizerPage')
);

const render = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<Skeleton className="w-full h-full" />}>
    <Component />
  </Suspense>
);

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Navigate to="/editor" replace />} />
      <Route path="editor" element={render(EditorPage)} />
      <Route path="book" element={render(BookManagerPage)} />
      <Route path="characters" element={render(CharactersPage)} />
      <Route path="world">
        <Route index element={render(WorldBuilderPage)} />
        <Route path="locations">
          <Route index element={render(LocationsPage)} />
          <Route path=":name" element={render(LocationDetailPage)} />
        </Route>
      </Route>
      <Route path="plot" element={render(PlotManagerPage)} />
      <Route path="magic" element={render(MagicSystemPage)} />
      <Route path="tech" element={render(TechSystemPage)} />
      <Route path="timeline" element={render(TimelinePage)} />
      <Route path="relationships" element={render(RelationshipVisualizerPage)} />
    </Route>
  </Routes>
);

export default AppRoutes;
