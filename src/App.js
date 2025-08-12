import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";

// importe seus módulos
import UniverseCreator from "./universe-creator.tsx";
import TimelineManager from "./timeline-world-history-manager.tsx";
import FictionEditor from "./fantasy-fiction-editor.tsx";
import QuestPlotArcManager from "./QuestPlotArc.jsx";
import MagicSystemBuilder from "./MagicSystemBuilder.jsx";

const Nav = () => (
  <header style={{borderBottom:"1px solid #eee", marginBottom:16}}>
    <nav style={{display:"flex", gap:12, padding:12}}>
      {[
        ["/", "Universo"],
        ["/timeline", "Linha do Tempo"],
        ["/editor", "Editor de Ficção"],
        ["/quests", "Quests & Arcos"],
        ["/magia", "Sistema de Magia"],
      ].map(([to, label]) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          style={({ isActive }) => ({
            textDecoration: "none",
            padding: "6px 10px",
            borderRadius: 8,
            background: isActive ? "#eef2ff" : "transparent",
            color: isActive ? "#4338ca" : "#374151",
            border: "1px solid #e5e7eb"
          })}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  </header>
);

export default function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path="/" element={<UniverseCreator />} />
        <Route path="/timeline" element={<TimelineManager />} />
        <Route path="/editor" element={<FictionEditor />} />
        <Route path="/quests" element={<QuestPlotArcManager />} />
        <Route path="/magia" element={<MagicSystemBuilder />} />
      </Routes>
    </div>
  );
}
