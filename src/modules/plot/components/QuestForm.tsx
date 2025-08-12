import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

interface QuestFormProps {
  initialQuest?: Quest;
  onSave: (quest: Quest) => void;
  onCancel: () => void;
}

const calculateProgress = (objectives: Objective[]): number => {
  if (objectives.length === 0) return 0;
  const done = objectives.filter(o => o.completed).length;
  return Math.round((done / objectives.length) * 100);
};

const QuestForm: React.FC<QuestFormProps> = ({ initialQuest, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: initialQuest?.title || '',
    description: initialQuest?.description || '',
    type: initialQuest?.type || 'main',
    objectives: initialQuest?.objectives || [{ id: uuidv4(), description: '', completed: false }],
    obstacles: initialQuest?.obstacles || '',
    twists: initialQuest?.twists || '',
    rewards: initialQuest?.rewards || '',
    consequences: initialQuest?.consequences || '',
    progress: initialQuest?.progress || 0,
    status: initialQuest?.status || 'available',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleObjectiveChange = (id: string, value: string) => {
    setForm(prev => ({
      ...prev,
      objectives: prev.objectives.map(o => (o.id === id ? { ...o, description: value } : o)),
    }));
  };

  const toggleObjectiveCompletion = (id: string) => {
    setForm(prev => ({
      ...prev,
      objectives: prev.objectives.map(o => (o.id === id ? { ...o, completed: !o.completed } : o)),
    }));
  };

  const addObjective = () => {
    setForm(prev => ({
      ...prev,
      objectives: [...prev.objectives, { id: uuidv4(), description: '', completed: false }],
    }));
  };

  const removeObjective = (id: string) => {
    setForm(prev => ({
      ...prev,
      objectives: prev.objectives.filter(o => o.id !== id),
    }));
  };

  const handleSubmit = () => {
    const progress = calculateProgress(form.objectives);
    const quest: Quest = {
      id: initialQuest?.id || uuidv4(),
      ...form,
      progress,
    };
    onSave(quest);
  };

  return (
    <div className="plot-quest-form">
      <h3>{initialQuest ? 'Edit Quest' : 'New Quest'}</h3>
      <label>
        Title:
        <input type="text" name="title" value={form.title} onChange={handleChange} />
      </label>
      <label>
        Description:
        <textarea name="description" value={form.description} onChange={handleChange} />
      </label>
      <label>
        Type:
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="main">Main Quest</option>
          <option value="side">Side Quest</option>
        </select>
      </label>
      <h4>Objectives</h4>
      {form.objectives.map(obj => (
        <div key={obj.id} className="plot-objective-item">
          <input type="checkbox" checked={obj.completed} onChange={() => toggleObjectiveCompletion(obj.id)} />
          <input
            type="text"
            value={obj.description}
            onChange={e => handleObjectiveChange(obj.id, e.target.value)}
            placeholder="Objective description"
          />
          <button onClick={() => removeObjective(obj.id)}>Remove</button>
        </div>
      ))}
      <button onClick={addObjective}>Add Objective</button>
      <label>
        Obstacles:
        <textarea name="obstacles" value={form.obstacles} onChange={handleChange} />
      </label>
      <label>
        Twists:
        <textarea name="twists" value={form.twists} onChange={handleChange} />
      </label>
      <label>
        Rewards:
        <textarea name="rewards" value={form.rewards} onChange={handleChange} />
      </label>
      <label>
        Consequences:
        <textarea name="consequences" value={form.consequences} onChange={handleChange} />
      </label>
      <label>
        Progress (%):
        <input type="number" name="progress" min="0" max="100" value={form.progress} onChange={handleChange} />
      </label>
      <label>
        Status:
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="available">Available</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </label>
      <button onClick={handleSubmit}>{initialQuest ? 'Update' : 'Create'} Quest</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default QuestForm;