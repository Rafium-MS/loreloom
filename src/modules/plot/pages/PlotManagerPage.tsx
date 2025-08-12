import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ArcCard from '../components/ArcCard';
import ArcForm from '../components/ArcForm';
import QuestCard from '../components/QuestCard';
import QuestForm from '../components/QuestForm';
import '../styles/plot.css';

type Arc = {
  id: string;
  title: string;
  description: string;
  act1: string;
  act2: string;
  act3: string;
  consequences: string;
  progress: number;
  status: string;
  quests: Quest[];
};

type Objective = {
  id: string;
  description: string;
  completed: boolean;
};

type Quest = {
  id: string;
  title: string;
  description: string;
  type: string;
  objectives: Objective[];
  obstacles: string;
  twists: string;
  rewards: string;
  consequences: string;
  progress: number;
  status: string;
};

const PlotManagerPage: React.FC = () => {
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [activeArcId, setActiveArcId] = useState<string | null>(null);
  const [showArcForm, setShowArcForm] = useState(false);
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [editingArc, setEditingArc] = useState<Arc | null>(null);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  const activeArc = arcs.find(a => a.id === activeArcId) || null;

  const saveArc = (arc: Arc) => {
    if (editingArc) {
      setArcs(arcs.map(a => (a.id === arc.id ? { ...arc, quests: editingArc.quests } : a)));
    } else {
      setArcs([...arcs, { ...arc, id: uuidv4(), quests: [] }]);
    }
    setShowArcForm(false);
    setEditingArc(null);
  };

  const deleteArc = (id: string) => {
    setArcs(arcs.filter(a => a.id !== id));
    if (activeArcId === id) {
      setActiveArcId(null);
    }
  };

  const saveQuest = (quest: Quest) => {
    if (!activeArcId) return;
    setArcs(arcs.map(arc => {
      if (arc.id !== activeArcId) return arc;
      if (editingQuest) {
        return {
          ...arc,
          quests: arc.quests.map(q => (q.id === quest.id ? quest : q)),
        };
      }
      return {
        ...arc,
        quests: [...arc.quests, { ...quest, id: uuidv4() }],
      };
    }));
    setShowQuestForm(false);
    setEditingQuest(null);
  };

  const deleteQuest = (id: string) => {
    if (!activeArcId) return;
    setArcs(arcs.map(arc =>
      arc.id === activeArcId
        ? { ...arc, quests: arc.quests.filter(q => q.id !== id) }
        : arc
    ));
  };

  return (
    <div className="plot-manager">
      <h2>Plot Arcs</h2>
      <button onClick={() => { setEditingArc(null); setShowArcForm(true); }}>Add Arc</button>
      <div className="plot-arc-list">
        {arcs.map(arc => (
          <ArcCard
            key={arc.id}
            arc={arc}
            isActive={arc.id === activeArcId}
            onSelect={() => setActiveArcId(arc.id)}
            onEdit={() => { setEditingArc(arc); setShowArcForm(true); }}
            onDelete={() => deleteArc(arc.id)}
          />
        ))}
      </div>
      {showArcForm && (
        <ArcForm
          initialArc={editingArc || undefined}
          onSave={saveArc}
          onCancel={() => { setShowArcForm(false); setEditingArc(null); }}
        />
      )}

      {activeArc && (
        <div>
          <h3>Quests for {activeArc.title}</h3>
          <button onClick={() => { setEditingQuest(null); setShowQuestForm(true); }}>Add Quest</button>
          <div className="plot-quest-list">
            {activeArc.quests.map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onEdit={() => { setEditingQuest(quest); setShowQuestForm(true); }}
                onDelete={() => deleteQuest(quest.id)}
              />
            ))}
          </div>
          {showQuestForm && (
            <QuestForm
              initialQuest={editingQuest || undefined}
              onSave={saveQuest}
              onCancel={() => { setShowQuestForm(false); setEditingQuest(null); }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PlotManagerPage;