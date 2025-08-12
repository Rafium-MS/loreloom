import React, { useState } from 'react';
import { Scene } from '../services/bookRepository';

interface SceneMetaFormProps {
  scene: Scene;
  onSave: (scene: Scene) => void;
}

const SceneMetaForm: React.FC<SceneMetaFormProps> = ({ scene, onSave }) => {
  const [draft, setDraft] = useState<Scene>(scene);

  const update = (field: keyof Scene, value: any) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Scene Metadata</h3>
      <label>
        Title
        <input value={draft.title} onChange={e => update('title', e.target.value)} />
      </label>
      <label>
        Synopsis
        <textarea value={draft.synopsis} onChange={e => update('synopsis', e.target.value)} />
      </label>
      <label>
        Status
        <input value={draft.status} onChange={e => update('status', e.target.value)} />
      </label>
      <label>
        Tags
        <input
          value={draft.tags.join(', ')}
          onChange={e =>
            update(
              'tags',
              e.target.value
                .split(',')
                .map(t => t.trim())
                .filter(Boolean)
            )
          }
        />
      </label>
      <label>
        Word Goal
        <input
          type="number"
          value={draft.wordGoal}
          onChange={e => update('wordGoal', parseInt(e.target.value, 10) || 0)}
        />
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default SceneMetaForm;