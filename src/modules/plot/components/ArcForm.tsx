import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
  quests: any[];
};

interface ArcFormProps {
  initialArc?: Arc;
  onSave: (arc: Arc) => void;
  onCancel: () => void;
}

const ArcForm: React.FC<ArcFormProps> = ({ initialArc, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: initialArc?.title || '',
    description: initialArc?.description || '',
    act1: initialArc?.act1 || '',
    act2: initialArc?.act2 || '',
    act3: initialArc?.act3 || '',
    consequences: initialArc?.consequences || '',
    progress: initialArc?.progress || 0,
    status: initialArc?.status || 'planning',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const arc: Arc = {
      id: initialArc?.id || uuidv4(),
      quests: initialArc?.quests || [],
      ...form,
    };
    onSave(arc);
  };

  return (
    <div className="plot-arc-form">
      <h3>{initialArc ? 'Edit Arc' : 'New Arc'}</h3>
      <label>
        Title:
        <input type="text" name="title" value={form.title} onChange={handleChange} />
      </label>
      <label>
        Description:
        <textarea name="description" value={form.description} onChange={handleChange} />
      </label>
      <div className="plot-act-structure">
        <label>
          Act 1:
          <textarea name="act1" value={form.act1} onChange={handleChange} />
        </label>
        <label>
          Act 2:
          <textarea name="act2" value={form.act2} onChange={handleChange} />
        </label>
        <label>
          Act 3:
          <textarea name="act3" value={form.act3} onChange={handleChange} />
        </label>
      </div>
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
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="abandoned">Abandoned</option>
        </select>
      </label>
      <button onClick={handleSubmit}>{initialArc ? 'Update' : 'Create'} Arc</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default ArcForm;