import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import EditorPage from '../modules/editor/pages/EditorPage';
import BookManagerPage from '../modules/book/pages/BookManagerPage';
import CharactersPage from '../modules/characters/pages/CharactersPage';
import WorldBuilderPage from '../modules/world/pages/WorldBuilderPage';
import PlotManagerPage from '../modules/plot/pages/PlotManagerPage';
import MagicSystemPage from '../modules/magic/pages/MagicSystemPage';
import TechSystemPage from '../modules/tech/pages/TechSystemPage';
import TimelinePage from '../modules/timeline/pages/TimelinePage';
import RelationshipVisualizerPage from '../modules/relationships/RelationshipVisualizerPage';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/editor" replace />} />
    <Route path="/editor" element={<EditorPage />} />
    <Route path="/book" element={<BookManagerPage />} />
    <Route path="/characters" element={<CharactersPage />} />
    <Route path="/world" element={<WorldBuilderPage />} />
    <Route path="/plot" element={<PlotManagerPage />} />
    <Route path="/magic" element={<MagicSystemPage />} />
    <Route path="/tech" element={<TechSystemPage />} />
    <Route path="/timeline" element={<TimelinePage />} />
    <Route path="/relationships" element={<RelationshipVisualizerPage />} />
  </Routes>
);

export default AppRoutes;